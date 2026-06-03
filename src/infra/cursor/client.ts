/**
 * Cursor Agent CLI integration for agent interactions
 */

import type { AgentResponse } from '../../core/models/index.js';
import { crossSpawn, getErrorMessage } from '../../shared/utils/index.js';
import type { CursorCallOptions } from './types.js';

export type { CursorCallOptions } from './types.js';

const CURSOR_COMMAND = 'cursor-agent';
const CURSOR_ABORTED_MESSAGE = 'Cursor execution aborted';
const CURSOR_MAX_BUFFER_BYTES = 10 * 1024 * 1024;
const CURSOR_FORCE_KILL_DELAY_MS_DEFAULT = 1_000;
const CURSOR_ERROR_DETAIL_MAX_LENGTH = 400;

type CursorStreamSummary =
  | {
      success: true;
      result: string;
      sessionId?: string;
    }
  | {
      success: false;
      error: string;
      sessionId?: string;
    };

function resolveForceKillDelayMs(): number {
  const raw = process.env.TAKT_CURSOR_FORCE_KILL_DELAY_MS;
  if (!raw) {
    return CURSOR_FORCE_KILL_DELAY_MS_DEFAULT;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return CURSOR_FORCE_KILL_DELAY_MS_DEFAULT;
  }

  return parsed;
}

type CursorExecResult = {
  stdout: string;
  stderr: string;
};

type CursorExecError = Error & {
  code?: string | number;
  stdout?: string;
  stderr?: string;
  signal?: NodeJS.Signals | null;
};

function buildPrompt(prompt: string, systemPrompt?: string): string {
  if (!systemPrompt) {
    return prompt;
  }
  return `${systemPrompt}\n\n${prompt}`;
}

function buildArgs(prompt: string, options: CursorCallOptions, streamJson = false): string[] {
  const args = [
    '-p',
    '--trust',
    '--output-format',
    streamJson ? 'stream-json' : 'json',
    '--workspace',
    options.cwd,
  ];

  if (streamJson) {
    args.push('--stream-partial-output');
  }

  if (options.model) {
    args.push('--model', options.model);
  }

  if (options.sessionId) {
    args.push('--resume', options.sessionId);
  }

  if (options.permissionMode === 'full') {
    args.push('--force');
  }

  args.push('--', buildPrompt(prompt, options.systemPrompt));
  return args;
}

function buildEnv(cursorApiKey?: string): NodeJS.ProcessEnv {
  if (!cursorApiKey) {
    return process.env;
  }

  return {
    ...process.env,
    CURSOR_API_KEY: cursorApiKey,
  };
}

function createExecError(
  message: string,
  params: {
    code?: string | number;
    stdout?: string;
    stderr?: string;
    signal?: NodeJS.Signals | null;
    name?: string;
  } = {},
): CursorExecError {
  const error = new Error(message) as CursorExecError;
  if (params.name) {
    error.name = params.name;
  }
  error.code = params.code;
  error.stdout = params.stdout;
  error.stderr = params.stderr;
  error.signal = params.signal;
  return error;
}

function feedLineBuffer(
  chunk: string,
  buffer: { remainder: string },
  onLine: (line: string) => void,
): void {
  buffer.remainder += chunk;
  let newlineIndex = buffer.remainder.indexOf('\n');
  while (newlineIndex >= 0) {
    onLine(buffer.remainder.slice(0, newlineIndex));
    buffer.remainder = buffer.remainder.slice(newlineIndex + 1);
    newlineIndex = buffer.remainder.indexOf('\n');
  }
}

function execCursor(
  args: string[],
  options: CursorCallOptions,
  hooks?: { onStdoutLine?: (line: string) => void },
): Promise<CursorExecResult> {
  return new Promise<CursorExecResult>((resolve, reject) => {
    const child = crossSpawn(options.cursorCliPath ?? CURSOR_COMMAND, args, {
      cwd: options.cwd,
      env: buildEnv(options.cursorApiKey),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let settled = false;
    let abortTimer: ReturnType<typeof setTimeout> | undefined;
    const stdoutLineBuffer = { remainder: '' };

    const abortHandler = (): void => {
      if (settled) return;
      child.kill('SIGTERM');
      const forceKillDelayMs = resolveForceKillDelayMs();
      abortTimer = setTimeout(() => {
        if (!settled) {
          child.kill('SIGKILL');
        }
      }, forceKillDelayMs);
      abortTimer.unref?.();
    };

    const cleanup = (): void => {
      if (abortTimer !== undefined) {
        clearTimeout(abortTimer);
      }
      if (options.abortSignal) {
        options.abortSignal.removeEventListener('abort', abortHandler);
      }
    };

    const resolveOnce = (result: CursorExecResult): void => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    const rejectOnce = (error: CursorExecError): void => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };

    const appendChunk = (target: 'stdout' | 'stderr', chunk: Buffer | string): void => {
      const text = typeof chunk === 'string' ? chunk : chunk.toString('utf-8');
      const byteLength = Buffer.byteLength(text);

      if (target === 'stdout') {
        stdoutBytes += byteLength;
        if (stdoutBytes > CURSOR_MAX_BUFFER_BYTES) {
          child.kill('SIGTERM');
          rejectOnce(createExecError('cursor-agent stdout exceeded buffer limit', {
            code: 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER',
            stdout,
            stderr,
          }));
          return;
        }
        stdout += text;
        return;
      }

      stderrBytes += byteLength;
      if (stderrBytes > CURSOR_MAX_BUFFER_BYTES) {
        child.kill('SIGTERM');
        rejectOnce(createExecError('cursor-agent stderr exceeded buffer limit', {
          code: 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER',
          stdout,
          stderr,
        }));
        return;
      }
      stderr += text;
    };

    child.stdout?.on('data', (chunk: Buffer | string) => {
      const text = typeof chunk === 'string' ? chunk : chunk.toString('utf-8');
      appendChunk('stdout', text);
      if (hooks?.onStdoutLine) {
        feedLineBuffer(text, stdoutLineBuffer, hooks.onStdoutLine);
      }
    });
    child.stderr?.on('data', (chunk: Buffer | string) => appendChunk('stderr', chunk));

    child.on('error', (error: NodeJS.ErrnoException) => {
      rejectOnce(createExecError(error.message, {
        code: error.code,
        stdout,
        stderr,
      }));
    });

    child.on('close', (code: number | null, signal: NodeJS.Signals | null) => {
      if (settled) return;

      if (options.abortSignal?.aborted) {
        rejectOnce(createExecError(CURSOR_ABORTED_MESSAGE, {
          name: 'AbortError',
          stdout,
          stderr,
          signal,
        }));
        return;
      }

      if (code === 0) {
        if (hooks?.onStdoutLine && stdoutLineBuffer.remainder.length > 0) {
          hooks.onStdoutLine(stdoutLineBuffer.remainder);
          stdoutLineBuffer.remainder = '';
        }
        resolveOnce({ stdout, stderr });
        return;
      }

      rejectOnce(createExecError(
        signal
          ? `cursor-agent terminated by signal ${signal}`
          : `cursor-agent exited with code ${code ?? 'unknown'}`,
        {
          code: code ?? undefined,
          stdout,
          stderr,
          signal,
        },
      ));
    });

    if (options.abortSignal) {
      if (options.abortSignal.aborted) {
        abortHandler();
      } else {
        options.abortSignal.addEventListener('abort', abortHandler, { once: true });
      }
    }
  });
}

function toRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function firstNonEmptyString(values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }
  return undefined;
}

function extractContent(payload: unknown): string | undefined {
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (Array.isArray(payload)) {
    const parts = payload
      .map((entry) => extractContent(entry))
      .filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);
    return parts.length > 0 ? parts.join('\n') : undefined;
  }

  const record = toRecord(payload);
  if (!record) {
    return undefined;
  }

  const direct = firstNonEmptyString([
    record.content,
    record.text,
    record.output,
    record.result,
    record.message,
  ]);
  if (direct) {
    return direct;
  }

  const nested = [record.data, record.response, record.payload]
    .map((entry) => extractContent(entry))
    .find((entry): entry is string => typeof entry === 'string' && entry.length > 0);
  if (nested) {
    return nested;
  }

  return undefined;
}

function extractSessionId(payload: unknown): string | undefined {
  const record = toRecord(payload);
  if (!record) {
    return undefined;
  }

  const nestedData = toRecord(record.data);
  const nestedPayload = toRecord(record.payload);
  const nestedResponse = toRecord(record.response);

  return firstNonEmptyString([
    record.sessionId,
    record.session_id,
    record.chatId,
    record.chat_id,
    nestedData?.sessionId,
    nestedData?.session_id,
    nestedData?.chatId,
    nestedData?.chat_id,
    nestedPayload?.sessionId,
    nestedPayload?.session_id,
    nestedPayload?.chatId,
    nestedPayload?.chat_id,
    nestedResponse?.sessionId,
    nestedResponse?.session_id,
    nestedResponse?.chatId,
    nestedResponse?.chat_id,
  ]);
}

function extractAssistantDelta(payload: unknown): string | undefined {
  const record = toRecord(payload);
  const message = toRecord(record?.message);
  const content = message?.content;
  if (!Array.isArray(content)) {
    return undefined;
  }

  const parts = content
    .map((entry) => {
      const block = toRecord(entry);
      return block?.type === 'text' && typeof block.text === 'string' ? block.text : undefined;
    })
    .filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);

  return parts.length > 0 ? parts.join('') : undefined;
}

function trimDetail(value: string | undefined, fallback = ''): string {
  const normalized = (value ?? '').trim();
  if (!normalized) {
    return fallback;
  }
  return normalized.length > CURSOR_ERROR_DETAIL_MAX_LENGTH
    ? `${normalized.slice(0, CURSOR_ERROR_DETAIL_MAX_LENGTH)}...`
    : normalized;
}

function isAuthenticationError(error: CursorExecError): boolean {
  const message = [
    trimDetail(error.message),
    trimDetail(error.stderr),
    trimDetail(error.stdout),
  ].join('\n').toLowerCase();

  const patterns = [
    'authentication',
    'unauthorized',
    'forbidden',
    'api key',
    'not logged in',
    'login required',
    'cursor_api_key',
  ];
  return patterns.some((pattern) => message.includes(pattern));
}

function classifyExecutionError(error: CursorExecError, options: CursorCallOptions): string {
  if (options.abortSignal?.aborted || error.name === 'AbortError') {
    return CURSOR_ABORTED_MESSAGE;
  }

  if (error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') {
    return 'Cursor Agent CLI output exceeded buffer limit';
  }

  if (error.code === 'ENOENT') {
    return 'cursor-agent binary not found. Install Cursor Agent CLI and ensure `cursor-agent` is in PATH.';
  }

  if (isAuthenticationError(error)) {
    return 'Cursor authentication failed. Run `cursor-agent login` or set TAKT_CURSOR_API_KEY/cursor_api_key.';
  }

  if (typeof error.code === 'number') {
    const detail = trimDetail(error.stderr, trimDetail(error.stdout, getErrorMessage(error)));
    return `Cursor Agent CLI exited with code ${error.code}: ${detail}`;
  }

  return getErrorMessage(error);
}

function parseCursorOutput(stdout: string): { content: string; sessionId?: string } | { error: string } {
  const trimmed = stdout.trim();
  if (!trimmed) {
    return { error: 'cursor-agent returned empty output' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return {
      error: `Failed to parse cursor-agent JSON output: ${trimDetail(trimmed, '<empty>')}`,
    };
  }

  const content = extractContent(parsed);
  if (!content) {
    return {
      error: `Failed to extract assistant content from cursor-agent JSON output: ${trimDetail(trimmed, '<empty>')}`,
    };
  }

  const sessionId = extractSessionId(parsed);
  return { content, sessionId };
}

function parseCursorStreamSummary(stdout: string): CursorStreamSummary | undefined {
  const lines = stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let streamedText = '';
  let latestSessionId: string | undefined;

  for (const line of lines) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }

    const record = toRecord(parsed);
    if (!record) {
      continue;
    }

    const sessionId = firstNonEmptyString([record.session_id, record.sessionId]);
    if (sessionId) {
      latestSessionId = sessionId;
    }

    if (record.type === 'assistant') {
      const delta = extractAssistantDelta(record);
      if (delta) {
        const nextChunk = delta.startsWith(streamedText)
          ? delta.slice(streamedText.length)
          : delta;
        streamedText += nextChunk;
      }
      continue;
    }

    if (record.type === 'result') {
      const success = record.subtype === 'success' || record.is_error === false;
      const result = typeof record.result === 'string' ? record.result : streamedText;
      if (success) {
        return { success: true, result, sessionId: latestSessionId };
      }

      const error =
        firstNonEmptyString([
          record.error,
          record.message,
          typeof record.result === 'string' ? record.result : undefined,
        ]) ?? 'Cursor Agent CLI returned an error';
      return { success: false, error, sessionId: latestSessionId };
    }
  }

  if (streamedText) {
    return { success: true, result: streamedText, sessionId: latestSessionId };
  }

  return undefined;
}

function forwardCursorStreamLine(
  rawLine: string,
  options: CursorCallOptions,
  state: {
    latestSessionId?: string;
    sawStreamEvent: boolean;
    finalResult?: CursorStreamSummary;
    streamedText: string;
  },
): void {
  const trimmed = rawLine.trim();
  if (!trimmed || !options.onStream) {
    return;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return;
  }

  const record = toRecord(parsed);
  if (!record) {
    return;
  }

  state.sawStreamEvent = true;
  const sessionId = firstNonEmptyString([record.session_id, record.sessionId]);
  if (sessionId) {
    state.latestSessionId = sessionId;
  }

  if (record.type === 'system' && record.subtype === 'init') {
    options.onStream({
      type: 'init',
      data: {
        model: typeof record.model === 'string' ? record.model : options.model ?? '',
        sessionId: state.latestSessionId ?? options.sessionId ?? '',
      },
    });
    return;
  }

  if (record.type === 'assistant') {
    const delta = extractAssistantDelta(record);
    if (!delta) {
      return;
    }
    const nextChunk = delta.startsWith(state.streamedText)
      ? delta.slice(state.streamedText.length)
      : delta;
    if (!nextChunk) {
      return;
    }
    state.streamedText += nextChunk;
    options.onStream({ type: 'text', data: { text: nextChunk } });
    return;
  }

  if (record.type === 'result') {
    const success = record.subtype === 'success' || record.is_error === false;
    if (success) {
      const result = typeof record.result === 'string' ? record.result : '';
      state.finalResult = {
        success: true,
        result,
        sessionId: state.latestSessionId ?? options.sessionId,
      };
      options.onStream({
        type: 'result',
        data: {
          result,
          success: true,
          sessionId: state.latestSessionId ?? options.sessionId ?? '',
        },
      });
      return;
    }

    const error =
      firstNonEmptyString([
        record.error,
        record.message,
        typeof record.result === 'string' ? record.result : undefined,
      ]) ?? 'Cursor Agent CLI returned an error';
    state.finalResult = {
      success: false,
      error,
      sessionId: state.latestSessionId ?? options.sessionId,
    };
    options.onStream({
      type: 'result',
      data: {
        result: '',
        success: false,
        error,
        sessionId: state.latestSessionId ?? options.sessionId ?? '',
      },
    });
  }
}

/**
 * Client for Cursor Agent CLI interactions.
 */
export class CursorClient {
  async call(agentType: string, prompt: string, options: CursorCallOptions): Promise<AgentResponse> {
    const streamJson = typeof options.onStream === 'function';
    const args = buildArgs(prompt, options, streamJson);
    const streamState = {
      latestSessionId: options.sessionId,
      sawStreamEvent: false,
      finalResult: undefined as CursorStreamSummary | undefined,
      streamedText: '',
    };

    try {
      const { stdout } = await execCursor(
        args,
        options,
        streamJson
          ? {
              onStdoutLine: (line) => {
                forwardCursorStreamLine(line, options, streamState);
              },
            }
          : undefined,
      );

      if (streamJson) {
        const streamed = streamState.finalResult ?? parseCursorStreamSummary(stdout);
        if (streamed) {
          return streamed.success
            ? {
                persona: agentType,
                status: 'done',
                content: streamed.result,
                timestamp: new Date(),
                sessionId: streamed.sessionId ?? streamState.latestSessionId,
              }
            : {
                persona: agentType,
                status: 'error',
                content: streamed.error,
                timestamp: new Date(),
                sessionId: streamed.sessionId ?? streamState.latestSessionId,
              };
        }
      }

      const parsed = parseCursorOutput(stdout);
      if ('error' in parsed) {
        return {
          persona: agentType,
          status: 'error',
          content: parsed.error,
          timestamp: new Date(),
          sessionId: options.sessionId,
        };
      }

      const sessionId = parsed.sessionId ?? options.sessionId;
      if (options.onStream) {
        const shouldEmitFallbackStream = !streamJson || !streamState.sawStreamEvent;
        if (shouldEmitFallbackStream) {
          options.onStream({ type: 'text', data: { text: parsed.content } });
          options.onStream({
            type: 'result',
            data: {
              result: parsed.content,
              success: true,
              sessionId: sessionId ?? '',
            },
          });
        }
      }

      return {
        persona: agentType,
        status: 'done',
        content: parsed.content,
        timestamp: new Date(),
        sessionId,
      };
    } catch (rawError) {
      const error = rawError as CursorExecError;
      const message = classifyExecutionError(error, options);
      if (options.onStream) {
        options.onStream({
          type: 'result',
          data: {
            result: '',
            success: false,
            error: message,
            sessionId: options.sessionId ?? '',
          },
        });
      }
      return {
        persona: agentType,
        status: 'error',
        content: message,
        timestamp: new Date(),
        sessionId: options.sessionId,
      };
    }
  }

  async callCustom(
    agentName: string,
    prompt: string,
    systemPrompt: string,
    options: CursorCallOptions,
  ): Promise<AgentResponse> {
    return this.call(agentName, prompt, {
      ...options,
      systemPrompt,
    });
  }
}

const defaultClient = new CursorClient();

export async function callCursor(
  agentType: string,
  prompt: string,
  options: CursorCallOptions,
): Promise<AgentResponse> {
  return defaultClient.call(agentType, prompt, options);
}

export async function callCursorCustom(
  agentName: string,
  prompt: string,
  systemPrompt: string,
  options: CursorCallOptions,
): Promise<AgentResponse> {
  return defaultClient.callCustom(agentName, prompt, systemPrompt, options);
}

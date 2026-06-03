/**
 * Ollama provider — OpenAI-compatible chat completions against a local server.
 */

import type { AgentResponse } from '../../core/models/index.js';
import type { StreamEvent } from '../../shared/types/provider.js';
import { resolveOllamaOrigin } from './resolve-base-url.js';
import type { OllamaCallOptions } from './types.js';

const TOOLS_SKIPPED_NOTE =
  '\n\n[Note: Ollama provider does not execute tools; request was answered as chat-only.]';

interface OpenAiChatCompletionResponse {
  choices?: Array<{
    message?: { content?: string | null };
  }>;
  error?: { message?: string };
}

interface OpenAiChatCompletionStreamChunk {
  choices?: Array<{
    delta?: { content?: string | null };
    message?: { content?: string | null };
  }>;
  error?: { message?: string };
}

function blockedResponse(persona: string, error: string, sessionId?: string): AgentResponse {
  return {
    persona,
    status: 'blocked',
    content: error,
    timestamp: new Date(),
    sessionId,
    error,
  };
}

function doneResponse(persona: string, content: string, sessionId?: string): AgentResponse {
  return {
    persona,
    status: 'done',
    content,
    timestamp: new Date(),
    sessionId,
  };
}

function emitStream(
  onStream: OllamaCallOptions['onStream'],
  model: string,
  sessionId: string,
  content: string,
): void {
  if (!onStream) return;
  const init: StreamEvent = { type: 'init', data: { model, sessionId } };
  onStream(init);
  onStream({ type: 'text', data: { text: content } });
  onStream({
    type: 'result',
    data: { success: true, result: content, sessionId },
  });
}

function emitStreamInit(
  onStream: OllamaCallOptions['onStream'],
  model: string,
  sessionId: string,
): void {
  if (!onStream) return;
  const init: StreamEvent = { type: 'init', data: { model, sessionId } };
  onStream(init);
}

function emitStreamText(onStream: OllamaCallOptions['onStream'], text: string): void {
  if (!onStream || text.length === 0) return;
  onStream({ type: 'text', data: { text } });
}

function emitStreamResult(
  onStream: OllamaCallOptions['onStream'],
  sessionId: string,
  content: string,
): void {
  if (!onStream) return;
  onStream({
    type: 'result',
    data: { success: true, result: content, sessionId },
  });
}

function parseStreamPayload(rawLine: string): OpenAiChatCompletionStreamChunk | null {
  const trimmed = rawLine.trim();
  if (!trimmed) return null;

  const payload = trimmed.startsWith('data:')
    ? trimmed.slice('data:'.length).trim()
    : trimmed;
  if (!payload || payload === '[DONE]') return null;

  try {
    return JSON.parse(payload) as OpenAiChatCompletionStreamChunk;
  } catch {
    return null;
  }
}

function readResponseContent(body: OpenAiChatCompletionResponse): string {
  return body.choices?.[0]?.message?.content?.trim() ?? '';
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as OpenAiChatCompletionResponse;
    if (typeof body.error?.message === 'string' && body.error.message.trim()) {
      return body.error.message;
    }
  } catch {
    // fall back to generic message
  }
  return `Ollama request failed with status ${response.status}`;
}

function appendAssistantDelta(current: string, candidate: string): {
  next: string;
  delta: string;
} {
  if (!candidate) {
    return { next: current, delta: '' };
  }

  const delta = candidate.startsWith(current) ? candidate.slice(current.length) : candidate;
  if (!delta) {
    return { next: current, delta: '' };
  }
  return { next: current + delta, delta };
}

async function readStreamingCompletion(
  response: Response,
  onDelta: (text: string) => void,
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Ollama streaming response body is unavailable.');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let content = '';

  const processLine = (line: string): void => {
    const payload = parseStreamPayload(line);
    if (!payload) return;

    if (typeof payload.error?.message === 'string' && payload.error.message.trim()) {
      throw new Error(payload.error.message);
    }

    for (const choice of payload.choices ?? []) {
      const deltaCandidate = choice?.delta?.content;
      if (typeof deltaCandidate === 'string' && deltaCandidate.length > 0) {
        content += deltaCandidate;
        onDelta(deltaCandidate);
      }

      const messageCandidate = choice?.message?.content;
      if (typeof messageCandidate === 'string' && messageCandidate.length > 0) {
        const appended = appendAssistantDelta(content, messageCandidate);
        if (appended.delta) {
          content = appended.next;
          onDelta(appended.delta);
        }
      }
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    let newlineIndex = buffer.indexOf('\n');
    while (newlineIndex >= 0) {
      processLine(buffer.slice(0, newlineIndex));
      buffer = buffer.slice(newlineIndex + 1);
      newlineIndex = buffer.indexOf('\n');
    }
  }

  buffer += decoder.decode();
  if (buffer.trim()) {
    processLine(buffer);
  }

  return content;
}

export async function callOllama(
  personaName: string,
  prompt: string,
  options: OllamaCallOptions,
): Promise<AgentResponse> {
  return callOllamaWithMessages(personaName, prompt, undefined, options);
}

export async function callOllamaCustom(
  personaName: string,
  prompt: string,
  systemPrompt: string,
  options: OllamaCallOptions,
): Promise<AgentResponse> {
  return callOllamaWithMessages(personaName, prompt, systemPrompt, options);
}

async function callOllamaWithMessages(
  personaName: string,
  prompt: string,
  systemPrompt: string | undefined,
  options: OllamaCallOptions,
): Promise<AgentResponse> {
  const model = options.model?.trim();
  if (!model) {
    return blockedResponse(personaName, 'Ollama provider requires a model id.');
  }

  const origin = resolveOllamaOrigin(options.providerOptions, process.env.OLLAMA_HOST);
  const sessionId = `ollama-${Date.now()}`;
  const messages: Array<{ role: 'system' | 'user'; content: string }> = [];
  if (systemPrompt?.trim()) {
    messages.push({ role: 'system', content: systemPrompt.trim() });
  }
  messages.push({ role: 'user', content: prompt });

  const controller = new AbortController();
  const onAbort = (): void => controller.abort(options.abortSignal?.reason);
  if (options.abortSignal) {
    if (options.abortSignal.aborted) {
      onAbort();
    } else {
      options.abortSignal.addEventListener('abort', onAbort, { once: true });
    }
  }

  try {
    const streamRequested = typeof options.onStream === 'function';
    const response = await fetch(`${origin}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: streamRequested,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      return blockedResponse(personaName, message, sessionId);
    }

    if (streamRequested) {
      emitStreamInit(options.onStream, model, sessionId);
      const streamedContent = await readStreamingCompletion(response, (delta) => {
        emitStreamText(options.onStream, delta);
      });
      if (!streamedContent.trim()) {
        return blockedResponse(personaName, 'Ollama returned an empty completion.', sessionId);
      }
      const finalContent = appendToolsSkippedNote(streamedContent, options);
      if (finalContent !== streamedContent) {
        const appended = appendAssistantDelta(streamedContent, finalContent);
        if (appended.delta) {
          emitStreamText(options.onStream, appended.delta);
        }
      }
      emitStreamResult(options.onStream, sessionId, finalContent);
      return doneResponse(personaName, finalContent, sessionId);
    }

    const body = (await response.json()) as OpenAiChatCompletionResponse;
    const content = readResponseContent(body);
    if (!content) {
      return blockedResponse(personaName, 'Ollama returned an empty completion.', sessionId);
    }

    const finalContent = appendToolsSkippedNote(content, options);
    emitStream(options.onStream, model, sessionId, finalContent);
    return doneResponse(personaName, finalContent, sessionId);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return blockedResponse(personaName, 'Ollama request aborted.', sessionId);
    }
    const message = error instanceof Error ? error.message : String(error);
    return blockedResponse(personaName, message, sessionId);
  }
}

function hasRequestedTools(options: OllamaCallOptions): boolean {
  if (options.allowedTools && options.allowedTools.length > 0) {
    return true;
  }
  const fromClaude = options.providerOptions?.claude?.allowedTools;
  return Boolean(fromClaude && fromClaude.length > 0);
}

function appendToolsSkippedNote(content: string, options: OllamaCallOptions): string {
  if (!hasRequestedTools(options)) {
    return content;
  }
  return content + TOOLS_SKIPPED_NOTE;
}

export { TOOLS_SKIPPED_NOTE };

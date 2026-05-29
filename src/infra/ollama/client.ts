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
    const response = await fetch(`${origin}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
      signal: controller.signal,
    });

    const body = (await response.json()) as OpenAiChatCompletionResponse;
    if (!response.ok) {
      const message =
        typeof body.error?.message === 'string'
          ? body.error.message
          : `Ollama request failed with status ${response.status}`;
      return blockedResponse(personaName, message, sessionId);
    }

    const content = body.choices?.[0]?.message?.content?.trim() ?? '';
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

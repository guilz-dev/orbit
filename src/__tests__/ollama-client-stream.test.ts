import { afterEach, describe, expect, it, vi } from 'vitest';
import { TOOLS_SKIPPED_NOTE, callOllama } from '../infra/ollama/client.js';
import type { StreamEvent } from '../shared/types/provider.js';

function createSseResponse(lines: string[]): Response {
  return new Response(`${lines.join('\n')}\n`, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

describe('ollama client stream mode', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('emits incremental stream events when onStream is provided', async () => {
    const fetchMock = vi.fn(async (_input: unknown, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? '{}')) as { stream?: boolean };
      expect(body.stream).toBe(true);

      return createSseResponse([
        'data: {"choices":[{"delta":{"content":"Hel"}}]}',
        'data: {"choices":[{"delta":{"content":"lo"}}]}',
        'data: {"choices":[{"delta":{"content":"!"}}]}',
        'data: [DONE]',
      ]);
    });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const events: StreamEvent[] = [];
    const result = await callOllama('assistant', 'hello', {
      cwd: '/tmp',
      model: 'ollama-model',
      onStream: (event) => {
        events.push(event);
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.status).toBe('done');
    expect(result.content).toBe('Hello!');
    expect(events[0]).toMatchObject({ type: 'init' });
    expect(events.at(-1)).toMatchObject({ type: 'result' });

    const streamedText = events
      .filter((event): event is Extract<StreamEvent, { type: 'text' }> => event.type === 'text')
      .map((event) => event.data.text)
      .join('');
    expect(streamedText).toBe('Hello!');
  });

  it('appends tools skipped note to streamed output when tools are requested', async () => {
    const fetchMock = vi.fn(async () =>
      createSseResponse([
        'data: {"choices":[{"delta":{"content":"reply"}}]}',
        'data: [DONE]',
      ]),
    );
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const events: StreamEvent[] = [];
    const result = await callOllama('assistant', 'hello', {
      cwd: '/tmp',
      model: 'ollama-model',
      allowedTools: ['Read'],
      onStream: (event) => {
        events.push(event);
      },
    });

    expect(result.status).toBe('done');
    expect(result.content).toBe(`reply${TOOLS_SKIPPED_NOTE}`);
    const streamedText = events
      .filter((event): event is Extract<StreamEvent, { type: 'text' }> => event.type === 'text')
      .map((event) => event.data.text)
      .join('');
    expect(streamedText).toBe(`reply${TOOLS_SKIPPED_NOTE}`);
  });

  it('uses non-stream request when onStream is not provided', async () => {
    const fetchMock = vi.fn(async (_input: unknown, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? '{}')) as { stream?: boolean };
      expect(body.stream).toBe(false);

      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: 'single response',
              },
            },
          ],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const result = await callOllama('assistant', 'hello', {
      cwd: '/tmp',
      model: 'ollama-model',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.status).toBe('done');
    expect(result.content).toBe('single response');
  });
});

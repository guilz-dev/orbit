import { afterEach, describe, expect, it, vi } from 'vitest';
import { callOllama, TOOLS_SKIPPED_NOTE } from '../../../infra/ollama/client.js';
import { DEFAULT_OLLAMA_BASE_URL } from '../../../infra/ollama/resolve-base-url.js';

describe('callOllama', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.OLLAMA_HOST;
  });

  it('returns blocked when model is missing', async () => {
    const result = await callOllama('coder', 'hello', { cwd: '/tmp' });
    expect(result.status).toBe('blocked');
    expect(result.error).toContain('model');
  });

  it('calls OpenAI-compatible endpoint with resolved origin', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'hi there' } }],
      }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await callOllama('coder', 'hello', {
      cwd: '/tmp',
      model: 'llama3.2:latest',
      providerOptions: { ollama: { baseUrl: 'http://127.0.0.1:11435' } },
    });

    expect(result.status).toBe('done');
    expect(result.content).toBe('hi there');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:11435/v1/chat/completions',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('uses OLLAMA_HOST env when provider options omit baseUrl', async () => {
    process.env.OLLAMA_HOST = '127.0.0.1:11436';
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'ok' } }],
      }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    await callOllama('coder', 'hello', { cwd: '/tmp', model: 'm' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:11436/v1/chat/completions',
      expect.anything(),
    );
  });

  it('appends tools-skipped note when allowedTools are requested', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'answer' } }],
      }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await callOllama('coder', 'hello', {
      cwd: '/tmp',
      model: 'm',
      allowedTools: ['Read'],
    });

    expect(result.status).toBe('done');
    expect(result.content).toBe(`answer${TOOLS_SKIPPED_NOTE}`);
  });

  it('falls back to default origin', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 503,
      json: async () => ({ error: { message: 'down' } }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await callOllama('coder', 'hello', {
      cwd: '/tmp',
      model: 'm',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${DEFAULT_OLLAMA_BASE_URL}/v1/chat/completions`,
      expect.anything(),
    );
    expect(result.status).toBe('blocked');
    expect(result.error).toBe('down');
  });
});

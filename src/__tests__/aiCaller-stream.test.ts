import { afterEach, describe, expect, it, vi } from 'vitest';

const streamDisplayCtor = vi.fn();
const errorUi = vi.fn();

vi.mock('../shared/ui/index.js', () => ({
  StreamDisplay: streamDisplayCtor,
  info: vi.fn(),
  error: errorUi,
  blankLine: vi.fn(),
}));

vi.mock('../infra/config/index.js', () => ({
  updatePersonaSession: vi.fn(),
}));

vi.mock('../shared/context.js', () => ({
  isQuietMode: () => false,
}));

const mockCall = vi.fn(async (_prompt: string, options: { onStream?: (event: unknown) => void }) => {
  options.onStream?.({ type: 'text', data: { text: 'ok' } });
  return { content: 'ok', status: 'success', sessionId: 'sess_1' };
});

vi.mock('../infra/providers/index.js', () => ({
  getProvider: vi.fn(() => ({
    setup: () => ({
      call: (...args: Parameters<typeof mockCall>) => mockCall(...args),
    }),
  })),
}));

describe('callAIWithRetry onStream', () => {
  afterEach(() => {
    streamDisplayCtor.mockClear();
    errorUi.mockClear();
    mockCall.mockReset();
    mockCall.mockImplementation(async (_prompt, options) => {
      options.onStream?.({ type: 'text', data: { text: 'ok' } });
      return { content: 'ok', status: 'success', sessionId: 'sess_1' };
    });
    vi.restoreAllMocks();
  });

  it('uses custom onStream without constructing StreamDisplay', async () => {
    const { callAIWithRetry } = await import('../features/interactive/aiCaller.js');
    const events: unknown[] = [];
    const ctx = {
      provider: (await import('../infra/providers/index.js')).getProvider('mock'),
      providerType: 'mock' as const,
      model: 'm',
      lang: 'en' as const,
      personaName: 'test',
      sessionId: undefined,
    };

    await callAIWithRetry('hi', 'system', [], '/tmp', ctx, {
      onStream: (event) => {
        events.push(event);
      },
    });

    expect(streamDisplayCtor).not.toHaveBeenCalled();
    expect(events.length).toBeGreaterThan(0);
  });

  it('does not write TTY error UI when onStream is set and the provider call fails', async () => {
    mockCall.mockRejectedValueOnce(new Error('provider down'));
    const { callAIWithRetry } = await import('../features/interactive/aiCaller.js');
    const ctx = {
      provider: (await import('../infra/providers/index.js')).getProvider('mock'),
      providerType: 'mock' as const,
      model: 'm',
      lang: 'en' as const,
      personaName: 'test',
      sessionId: undefined,
    };

    const { result } = await callAIWithRetry('hi', 'system', [], '/tmp', ctx, {
      onStream: () => {},
    });

    expect(result).toBeNull();
    expect(streamDisplayCtor).not.toHaveBeenCalled();
    expect(errorUi).not.toHaveBeenCalled();
  });
});

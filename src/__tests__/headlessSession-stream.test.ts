import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { HeadlessInteractiveSnapshot } from '../features/interactive/headlessSession.types.js';
import { resolveHeadlessPermissionMode } from '../features/interactive/headlessTools.js';
import { loadTemplate } from '../shared/prompts/index.js';

let callAIWithRetryMock: ReturnType<typeof vi.fn>;

vi.mock('../features/interactive/aiCaller.js', () => ({
  callAIWithRetry: (...args: unknown[]) => callAIWithRetryMock(...args),
}));

vi.mock('../features/interactive/sessionInitialization.js', () => ({
  initializeSession: () => ({
    provider: { setup: () => ({ call: vi.fn() }) },
    providerType: 'mock',
    model: 'm',
    personaName: 'persona',
    sessionId: undefined,
  }),
}));

vi.mock('../features/interactive/workflow-context.js', () => ({
  buildInteractiveWorkflowContext: () => ({
    workflowStructure: '',
    stepPreviews: [],
  }),
}));

vi.mock('../features/interactive/assistantInitFiles.js', () => ({
  loadAssistantInitContext: () => undefined,
}));

vi.mock('../features/interactive/headlessTools.js', () => ({
  resolveHeadlessAllowedTools: () => ['Read'],
  resolveHeadlessPermissionMode: vi.fn(() => 'readonly'),
}));

vi.mock('../features/interactive/policyPrompt.js', () => ({
  buildInteractivePolicyPrompt: (_lang: string, message: string) => message,
}));

vi.mock('../features/interactive/promptSections.js', () => ({
  prependInitialPromptContext: (prompt: string) => prompt,
}));

vi.mock('../shared/prompts/index.js', () => ({
  loadTemplate: vi.fn(() => 'system'),
}));

describe('headlessSession stream sink finish', () => {
  const originalEnv = process.env.PLANETZ_HEADLESS_STREAM;
  let stderrChunks: string[];

  beforeEach(() => {
    stderrChunks = [];
    process.env.PLANETZ_HEADLESS_STREAM = '1';
    vi.mocked(resolveHeadlessPermissionMode).mockClear();
    vi.spyOn(process.stderr, 'write').mockImplementation((chunk: string | Uint8Array) => {
      stderrChunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8'));
      return true;
    });
    callAIWithRetryMock = vi.fn();
  });

  afterEach(() => {
    process.env.PLANETZ_HEADLESS_STREAM = originalEnv;
    vi.restoreAllMocks();
  });

  function baseSnapshot(): HeadlessInteractiveSnapshot {
    return {
      planetzSessionId: 'composer_sess_1',
      cwd: '/tmp/ws',
      workflowId: 'wf',
      provider: 'mock',
      model: 'm',
      lang: 'en',
      messages: [],
      workflowContext: { workflowStructure: '', stepPreviews: [] },
      assistantInitContext: undefined,
      systemPrompt: 'system',
      allowedTools: ['Read'],
      updatedAt: new Date().toISOString(),
    };
  }

  function parseStderrLines(): Record<string, unknown>[] {
    return stderrChunks
      .join('')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Record<string, unknown>);
  }

  it('emits done without aborted when callAIWithRetry succeeds', async () => {
    callAIWithRetryMock.mockResolvedValue({
      result: { content: 'ok', success: true, sessionId: 'p1' },
      sessionId: 'p1',
    });

    const { headlessInteractiveTurn } = await import('../features/interactive/headlessSession.js');
    await headlessInteractiveTurn(baseSnapshot(), { message: 'hi' });

    const lines = parseStderrLines();
    const terminal = lines.at(-1);
    expect(terminal).toMatchObject({ done: true });
    expect(terminal?.aborted).toBeUndefined();
  });

  it('passes readonly permission mode for Planetz clarify sessions', async () => {
    callAIWithRetryMock.mockResolvedValue({
      result: { content: 'ok', success: true, sessionId: 'p1' },
      sessionId: 'p1',
    });

    const { headlessInteractiveTurn } = await import('../features/interactive/headlessSession.js');
    await headlessInteractiveTurn(
      {
        ...baseSnapshot(),
        sessionPolicy: 'planetz-chat-clarify',
      },
      { message: 'hi' },
    );

    expect(callAIWithRetryMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(Array),
      expect.any(String),
      expect.any(Object),
      expect.objectContaining({ permissionMode: 'readonly' }),
    );
    expect(resolveHeadlessPermissionMode).toHaveBeenCalledWith('planetz-readonly');
  });

  it('rebuilds the system prompt on turn for persisted clarify snapshots', async () => {
    callAIWithRetryMock.mockResolvedValue({
      result: { content: 'ok', success: true, sessionId: 'p1' },
      sessionId: 'p1',
    });
    vi.mocked(loadTemplate).mockClear();

    const { headlessInteractiveTurn } = await import('../features/interactive/headlessSession.js');
    await headlessInteractiveTurn(
      {
        ...baseSnapshot(),
        sessionPolicy: 'planetz-chat-clarify',
        systemPrompt: 'stale prompt',
      },
      { message: 'hi' },
    );

    expect(loadTemplate).toHaveBeenCalledWith(
      'score_planetz_chat_spec_system_prompt',
      'en',
      expect.any(Object),
    );
    expect(callAIWithRetryMock).toHaveBeenCalledWith(
      expect.any(String),
      'system',
      expect.any(Array),
      expect.any(String),
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('emits done without aborted when callAIWithRetry returns unsuccessful result', async () => {
    callAIWithRetryMock.mockResolvedValue({
      result: { content: 'blocked', success: false, sessionId: undefined },
      sessionId: undefined,
    });

    const { headlessInteractiveTurn } = await import('../features/interactive/headlessSession.js');
    await headlessInteractiveTurn(baseSnapshot(), { message: 'hi' });

    const lines = parseStderrLines();
    const terminal = lines.at(-1);
    expect(terminal).toMatchObject({ done: true });
    expect(terminal?.aborted).toBeUndefined();
  });
});

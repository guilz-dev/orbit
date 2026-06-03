import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { HeadlessInteractiveSnapshot } from '../features/interactive/headlessSession.types.js';

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
  resolveHeadlessPermissionMode: () => 'readonly',
}));

vi.mock('../features/interactive/policyPrompt.js', () => ({
  buildInteractivePolicyPrompt: (_lang: string, message: string) => message,
}));

vi.mock('../features/interactive/promptSections.js', () => ({
  prependInitialPromptContext: (prompt: string) => prompt,
}));

vi.mock('../shared/prompts/index.js', () => ({
  loadTemplate: () => 'system',
}));

describe('headlessSession stream sink finish', () => {
  const originalEnv = process.env.PLANETZ_HEADLESS_STREAM;
  let stderrChunks: string[];

  beforeEach(() => {
    stderrChunks = [];
    process.env.PLANETZ_HEADLESS_STREAM = '1';
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

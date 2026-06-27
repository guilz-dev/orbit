import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  headlessInteractiveAccept,
  headlessInteractivePlay,
  headlessInteractiveStart,
} from '../features/interactive/headlessSession.js';
import { loadTemplate } from '../shared/prompts/index.js';

vi.mock('../infra/config/index.js', () => ({
  resolveConfigValues: vi.fn(() => ({
    language: 'en',
    interactivePreviewSteps: false,
  })),
}));

vi.mock('../shared/prompts/index.js', () => ({
  loadTemplate: vi.fn(() => 'system'),
}));

vi.mock('../features/interactive/sessionInitialization.js', () => ({
  initializeSession: vi.fn(() => ({
    providerType: 'mock',
    model: 'mock-model',
  })),
}));

vi.mock('../features/interactive/workflow-context.js', () => ({
  buildInteractiveWorkflowContext: vi.fn(() => ({
    name: 'default',
    description: '',
    workflowStructure: '',
    stepPreviews: [],
    taskHistory: [],
  })),
}));

vi.mock('../features/interactive/assistantInitFiles.js', () => ({
  loadAssistantInitContext: vi.fn(() => ''),
}));
import {
  READONLY_HEADLESS_TOOLS,
  resolveHeadlessAllowedTools,
} from '../features/interactive/headlessTools.js';

beforeEach(() => {
  vi.mocked(loadTemplate).mockClear();
});

describe('headlessInteractiveStart', () => {
  it('stores sourceContext on snapshot when seed has no user message', async () => {
    const { snapshot } = await headlessInteractiveStart({
      cwd: '/tmp',
      workflow: 'default',
      planetzSessionId: 'composer_ctx',
      seed: { sourceContext: '## Issue #7: Example' },
    });
    expect(snapshot.sourceContext).toBe('## Issue #7: Example');
    expect(snapshot.messages).toEqual([]);
  });

  it('uses the spec system prompt template for Planetz clarify sessions', async () => {
    await headlessInteractiveStart({
      cwd: '/tmp',
      workflow: 'spec-clarify',
      planetzSessionId: 'composer_clarify',
      sessionPolicy: 'planetz-chat-clarify',
    });

    expect(loadTemplate).toHaveBeenCalledWith(
      'score_planetz_chat_spec_system_prompt',
      'en',
      expect.any(Object),
    );
  });

  it('uses the spec system prompt template for Planetz decide sessions', async () => {
    await headlessInteractiveStart({
      cwd: '/tmp',
      workflow: 'spec-decide',
      planetzSessionId: 'composer_decide',
      sessionPolicy: 'planetz-chat-decide',
    });

    expect(loadTemplate).toHaveBeenCalledWith(
      'score_planetz_chat_spec_system_prompt',
      'en',
      expect.any(Object),
    );
  });
});

describe('resolveHeadlessAllowedTools', () => {
  it('defaults to readonly tools', () => {
    expect(resolveHeadlessAllowedTools(undefined)).toEqual([...READONLY_HEADLESS_TOOLS]);
  });

  it('uses orbit default tools when profile is orbit-default', () => {
    const tools = resolveHeadlessAllowedTools('orbit-default');
    expect(tools).toContain('Bash');
  });
});

describe('headlessInteractiveAccept', () => {
  const baseSnapshot = {
    planetzSessionId: 'composer_test',
    cwd: '/tmp',
    workflowId: 'default',
    provider: 'mock',
    lang: 'en' as const,
    messages: [] as Array<{ role: 'user' | 'assistant'; content: string }>,
    workflowContext: {
      name: 'default',
      description: '',
      workflowStructure: '',
      stepPreviews: [],
      taskHistory: [],
    },
    systemPrompt: 'system',
    allowedTools: [],
    updatedAt: new Date().toISOString(),
  };

  it('returns error when no assistant message exists', () => {
    const { result } = headlessInteractiveAccept(baseSnapshot);
    expect(result.kind).toBe('error');
  });

  it('returns latest assistant content as task', () => {
    const { result } = headlessInteractiveAccept({
      ...baseSnapshot,
      messages: [
        { role: 'user', content: 'hello' },
        { role: 'assistant', content: 'Task instruction draft' },
      ],
    });
    expect(result).toMatchObject({
      kind: 'accept',
      task: 'Task instruction draft',
      allowedActions: ['execute', 'save_task'],
    });
  });
});

describe('headlessInteractivePlay', () => {
  const baseSnapshot = {
    planetzSessionId: 'composer_test',
    cwd: '/tmp',
    workflowId: 'default',
    provider: 'mock',
    lang: 'en' as const,
    messages: [] as Array<{ role: 'user' | 'assistant'; content: string }>,
    workflowContext: {
      name: 'default',
      description: '',
      workflowStructure: '',
      stepPreviews: [],
      taskHistory: [],
    },
    systemPrompt: 'system',
    allowedTools: [],
    updatedAt: new Date().toISOString(),
  };

  it('returns error when task is empty', () => {
    const { result } = headlessInteractivePlay(baseSnapshot, { task: '   ' });
    expect(result.kind).toBe('error');
  });

  it('returns play task with execute and save_task actions', () => {
    const { result } = headlessInteractivePlay(baseSnapshot, {
      task: 'Run integration tests',
    });
    expect(result).toMatchObject({
      kind: 'play',
      task: 'Run integration tests',
      allowedActions: ['execute', 'save_task'],
    });
  });
});

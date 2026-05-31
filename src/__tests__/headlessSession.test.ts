import { describe, expect, it } from 'vitest';
import { headlessInteractiveAccept } from '../features/interactive/headlessSession.js';
import {
  READONLY_HEADLESS_TOOLS,
  resolveHeadlessAllowedTools,
} from '../features/interactive/headlessTools.js';

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

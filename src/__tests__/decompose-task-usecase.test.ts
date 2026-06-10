import { beforeEach, describe, expect, it, vi } from 'vitest';
import { decomposeTask, requestMoreParts } from '../agents/decompose-task-usecase.js';

const { mockRunAgent } = vi.hoisted(() => ({
  mockRunAgent: vi.fn(),
}));

vi.mock('../agents/runner.js', () => ({
  runAgent: mockRunAgent,
}));

const WORKTREE_FIXTURE = {
  projectCwd: '/tmp/isolated/repo',
  worktreeCwd: '/tmp/isolated/takt-worktrees/task-1',
  personaPath: '/tmp/isolated/repo/.takt/facets/personas/coder.md',
} as const;

describe('team leader decompose projectCwd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRunAgent.mockResolvedValue({
      persona: 'coder',
      status: 'done',
      content: '[]',
      structuredOutput: { parts: [{ id: 'part-1', title: 'A', instruction: 'Do A' }] },
      timestamp: new Date(),
    });
  });

  it('passes projectCwd to runAgent for worktree execution', async () => {
    const { projectCwd, worktreeCwd, personaPath } = WORKTREE_FIXTURE;

    await decomposeTask('break down work', 2, {
      cwd: worktreeCwd,
      projectCwd,
      persona: 'coder',
      personaPath,
    });

    expect(mockRunAgent).toHaveBeenCalledWith(
      'coder',
      expect.any(String),
      expect.objectContaining({
        cwd: worktreeCwd,
        projectCwd,
        personaPath,
      }),
    );
  });

  it('passes projectCwd to runAgent for requestMoreParts in worktree execution', async () => {
    mockRunAgent.mockResolvedValue({
      persona: 'coder',
      status: 'done',
      content: '{}',
      structuredOutput: { done: true, reasoning: 'enough', parts: [] },
      timestamp: new Date(),
    });

    const { projectCwd, worktreeCwd, personaPath } = WORKTREE_FIXTURE;

    await requestMoreParts('continue work', [], [], 1, {
      cwd: worktreeCwd,
      projectCwd,
      persona: 'coder',
      personaPath,
    });

    expect(mockRunAgent).toHaveBeenCalledWith(
      'coder',
      expect.any(String),
      expect.objectContaining({
        cwd: worktreeCwd,
        projectCwd,
        personaPath,
      }),
    );
  });
});

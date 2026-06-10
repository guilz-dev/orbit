import { describe, expect, it } from 'vitest';
import { buildTaskResult } from '../features/tasks/execute/taskResultHandler.js';
import type { TaskInfo } from '../infra/task/index.js';

function minimalTask(name: string): TaskInfo {
  return {
    name,
    content: 'task body',
    status: 'running',
    data: {},
  };
}

describe('buildTaskResult failure step persistence', () => {
  it('maps aborted run lastStep to failureStep for tasks.yaml', () => {
    const startedAt = '2026-06-10T00:22:33.000Z';
    const completedAt = '2026-06-10T00:29:20.000Z';
    const result = buildTaskResult({
      task: minimalTask('issue-21'),
      runResult: {
        success: false,
        reason: 'Step execution failed: persona path not allowed',
        lastStep: 'implement',
        lastMessage: 'write_tests completed report',
      },
      startedAt,
      completedAt,
    });

    expect(result.failureStep).toBe('implement');
    expect(result.success).toBe(false);
    expect(result.response).toContain('persona path not allowed');
    expect(result.failureLastMessage).toBe('write_tests completed report');
  });

  it('still records lastStep on successful completion (failureStep field mirrors lastStep)', () => {
    const result = buildTaskResult({
      task: minimalTask('done-task'),
      runResult: {
        success: true,
        lastStep: 'review',
        lastMessage: 'all good',
      },
      startedAt: '2026-06-10T00:00:00.000Z',
      completedAt: '2026-06-10T00:10:00.000Z',
    });

    expect(result.failureStep).toBe('review');
    expect(result.success).toBe(true);
  });
});

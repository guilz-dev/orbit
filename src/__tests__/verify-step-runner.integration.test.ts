/**
 * Integration tests for verify-only step execution and rule routing.
 */

import { describe, it, expect } from 'vitest';
import type { WorkflowState } from '../core/models/types.js';
import { runVerifyOnlyStep } from '../core/workflow/engine/verify-step-runner.js';
import { makeStep, makeRule } from './test-helpers.js';

function makeWorkflowState(): WorkflowState {
  return {
    workflowName: 'test',
    currentStep: 'verify_green',
    iteration: 1,
    stepOutputs: new Map(),
    structuredOutputs: new Map(),
    systemContexts: new Map(),
    effectResults: new Map(),
    userInputs: [],
    personaSessions: new Map(),
    stepIterations: new Map(),
    status: 'running',
  };
}

describe('runVerifyOnlyStep', () => {
  it('routes to __verify_pass when command succeeds', async () => {
    const step = makeStep({
      name: 'verify_green',
      instruction: '',
      verify: { command: 'node -e "process.exit(0)"', expect: 'pass' },
      rules: [
        makeRule('__verify_pass', 'COMPLETE'),
        makeRule('__verify_fail', 'implement_core'),
      ],
    });
    const state = makeWorkflowState();

    const response = await runVerifyOnlyStep(step, state, process.cwd(), {
      cwd: process.cwd(),
      detectRuleIndex: () => -1,
      structuredCaller: {} as never,
      interactive: false,
    });

    expect(response.matchedRuleIndex).toBe(0);
    expect(state.systemContexts.get('verify_green')?.verify_pass).toBe(true);
  });

  it('routes to __verify_fail when command fails', async () => {
    const step = makeStep({
      name: 'verify_green',
      instruction: '',
      verify: { command: 'node -e "process.exit(1)"', expect: 'pass' },
      rules: [
        makeRule('__verify_pass', 'COMPLETE'),
        makeRule('__verify_fail', 'implement_core'),
      ],
    });
    const state = makeWorkflowState();

    const response = await runVerifyOnlyStep(step, state, process.cwd(), {
      cwd: process.cwd(),
      detectRuleIndex: () => -1,
      structuredCaller: {} as never,
      interactive: false,
    });

    expect(response.matchedRuleIndex).toBe(1);
    expect(state.systemContexts.get('verify_green')?.verify_pass).toBe(false);
  });
});

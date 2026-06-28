/**
 * Unit tests for verify signal evaluation (__verify_pass / __verify_fail).
 */

import { describe, it, expect } from 'vitest';
import {
  evaluateVerifySignalCondition,
  isVerifySignalCondition,
} from '../core/workflow/evaluation/verify-signal-evaluator.js';
import type { WorkflowState } from '../core/models/types.js';
import { makeStep } from './test-helpers.js';

function makeState(verifyPass?: boolean): WorkflowState {
  const systemContexts = new Map<string, Record<string, unknown>>();
  if (verifyPass !== undefined) {
    systemContexts.set('verify_step', { verify_pass: verifyPass });
  }
  return {
    workflowName: 'test',
    currentStep: 'verify_step',
    iteration: 1,
    stepOutputs: new Map(),
    structuredOutputs: new Map(),
    systemContexts,
    effectResults: new Map(),
    userInputs: [],
    personaSessions: new Map(),
    stepIterations: new Map(),
    status: 'running',
  };
}

describe('isVerifySignalCondition', () => {
  it('recognizes verify signals', () => {
    expect(isVerifySignalCondition('__verify_pass')).toBe(true);
    expect(isVerifySignalCondition('__verify_fail')).toBe(true);
    expect(isVerifySignalCondition('approved')).toBe(false);
  });
});

describe('evaluateVerifySignalCondition', () => {
  const step = makeStep({ name: 'verify_step' });

  it('returns null for non-verify conditions', () => {
    expect(evaluateVerifySignalCondition('done', step, makeState(true))).toBeNull();
  });

  it('matches __verify_pass when verify_pass is true', () => {
    expect(evaluateVerifySignalCondition('__verify_pass', step, makeState(true))).toBe(true);
    expect(evaluateVerifySignalCondition('__verify_fail', step, makeState(true))).toBe(false);
  });

  it('matches __verify_fail when verify_pass is false or missing', () => {
    expect(evaluateVerifySignalCondition('__verify_fail', step, makeState(false))).toBe(true);
    expect(evaluateVerifySignalCondition('__verify_pass', step, makeState(false))).toBe(false);
    expect(evaluateVerifySignalCondition('__verify_fail', step, makeState())).toBe(true);
  });
});

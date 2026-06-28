/**
 * Tests for verify-only step contract (schema, normalizer, runtime share this).
 */

import { describe, it, expect } from 'vitest';
import {
  hasMeaningfulInstruction,
  isHybridVerifyAgentStep,
  isVerifyOnlyAgentFields,
  VERIFY_DEFAULT_INSTRUCTION_PLACEHOLDER,
} from '../core/models/verify-step-contract.js';
import { isVerifyOnlyStep } from '../core/workflow/engine/verify-step-utils.js';
import { makeStep } from './test-helpers.js';

describe('verify-step-contract', () => {
  it('treats {task} as non-instruction for verify-only detection', () => {
    expect(hasMeaningfulInstruction(VERIFY_DEFAULT_INSTRUCTION_PLACEHOLDER)).toBe(false);
    expect(isVerifyOnlyAgentFields({
      verify: { command: 'pnpm test' },
      instruction: VERIFY_DEFAULT_INSTRUCTION_PLACEHOLDER,
    })).toBe(true);
    expect(isHybridVerifyAgentStep({
      verify: { command: 'pnpm test' },
      instruction: VERIFY_DEFAULT_INSTRUCTION_PLACEHOLDER,
    })).toBe(false);
  });

  it('detects hybrid verify with persona or real instruction', () => {
    expect(isHybridVerifyAgentStep({
      verify: { command: 'pnpm test' },
      persona: 'coder',
    })).toBe(true);
    expect(isHybridVerifyAgentStep({
      verify: { command: 'pnpm test' },
      instruction: 'run tests',
    })).toBe(true);
  });

  it('matches runtime isVerifyOnlyStep for normalized steps', () => {
    const step = makeStep({
      name: 'verify_green',
      instruction: '',
      verify: { command: 'pnpm test', expect: 'pass' },
    });
    expect(isVerifyOnlyStep(step)).toBe(true);
    expect(isVerifyOnlyAgentFields({
      verify: step.verify,
      persona: step.persona,
      instruction: step.instruction,
    })).toBe(true);
  });
});

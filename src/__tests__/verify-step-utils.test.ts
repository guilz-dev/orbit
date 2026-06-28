/**
 * Unit tests for verify-only step detection.
 */

import { describe, it, expect } from 'vitest';
import { isVerifyOnlyStep } from '../core/workflow/engine/verify-step-utils.js';
import { makeStep } from './test-helpers.js';

describe('isVerifyOnlyStep', () => {
  it('returns true for verify-only agent steps', () => {
    const step = makeStep({
      name: 'verify_green',
      instruction: '',
      verify: { command: 'pnpm test', expect: 'pass' },
    });
    expect(isVerifyOnlyStep(step)).toBe(true);
  });

  it('returns false when persona or instruction is present', () => {
    const withPersona = makeStep({
      verify: { command: 'pnpm test', expect: 'pass' },
      persona: 'coder',
      instruction: '',
    });
    expect(isVerifyOnlyStep(withPersona)).toBe(false);

    const withInstruction = makeStep({
      verify: { command: 'pnpm test', expect: 'pass' },
      instruction: 'run tests',
    });
    expect(isVerifyOnlyStep(withInstruction)).toBe(false);
  });

  it('returns false without verify config', () => {
    expect(isVerifyOnlyStep(makeStep({ instruction: '' }))).toBe(false);
  });
});

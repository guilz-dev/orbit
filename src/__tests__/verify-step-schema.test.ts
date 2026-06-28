/**
 * Tests for verify-only step YAML validation.
 */

import { describe, it, expect } from 'vitest';
import { WorkflowStepRawSchema } from '../core/models/workflow-schemas.js';

const verifyOnlyBase = {
  name: 'verify_green',
  verify: { command: 'pnpm test', expect: 'pass' as const },
  rules: [
    { condition: '__verify_pass', next: 'COMPLETE' },
    { condition: '__verify_fail', next: 'implement_core' },
  ],
};

describe('WorkflowStepRawSchema verify steps', () => {
  it('accepts verify-only steps with pass and fail rules', () => {
    const parsed = WorkflowStepRawSchema.parse(verifyOnlyBase);
    expect(parsed.verify?.command).toBe('pnpm test');
  });

  it('rejects verify combined with persona', () => {
    expect(() => WorkflowStepRawSchema.parse({
      ...verifyOnlyBase,
      persona: 'coder',
    })).toThrow(/verify-only/);
  });

  it('rejects verify combined with instruction', () => {
    expect(() => WorkflowStepRawSchema.parse({
      ...verifyOnlyBase,
      instruction: 'run tests',
    })).toThrow(/verify-only/);
  });

  it('rejects verify when only __verify_pass rule is present', () => {
    expect(() => WorkflowStepRawSchema.parse({
      ...verifyOnlyBase,
      rules: [{ condition: '__verify_pass', next: 'COMPLETE' }],
    })).toThrow(/__verify_pass and __verify_fail/);
  });

  it('accepts verify-only with default instruction placeholder', () => {
    const parsed = WorkflowStepRawSchema.parse({
      ...verifyOnlyBase,
      instruction: '{task}',
    });
    expect(parsed.verify?.command).toBe('pnpm test');
  });
});

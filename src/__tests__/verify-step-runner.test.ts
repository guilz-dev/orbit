/**
 * Unit tests for verify command resolution.
 */

import { describe, it, expect } from 'vitest';
import {
  resolveVerifyPass,
  type VerifyCommandResult,
} from '../core/workflow/engine/verify-step-runner.js';

describe('resolveVerifyPass', () => {
  const success: VerifyCommandResult = { exitCode: 0, stdout: '', stderr: '' };
  const failure: VerifyCommandResult = { exitCode: 1, stdout: '', stderr: 'fail' };

  it('passes when expect is pass and exit code is zero', () => {
    expect(resolveVerifyPass({ command: 'pnpm test', expect: 'pass' }, success)).toBe(true);
    expect(resolveVerifyPass({ command: 'pnpm test', expect: 'pass' }, failure)).toBe(false);
  });

  it('passes when expect is fail and exit code is non-zero', () => {
    expect(resolveVerifyPass({ command: 'pnpm test', expect: 'fail' }, failure)).toBe(true);
    expect(resolveVerifyPass({ command: 'pnpm test', expect: 'fail' }, success)).toBe(false);
  });
});

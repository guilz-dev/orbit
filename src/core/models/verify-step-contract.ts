/**
 * Single source of truth for verify-only step shape (schema, normalizer, runtime).
 */

export const VERIFY_SIGNAL_PASS = '__verify_pass' as const;
export const VERIFY_SIGNAL_FAIL = '__verify_fail' as const;

export const VERIFY_SIGNALS = new Set<string>([VERIFY_SIGNAL_PASS, VERIFY_SIGNAL_FAIL]);

/** Default agent instruction placeholder; not treated as a real instruction on verify steps. */
export const VERIFY_DEFAULT_INSTRUCTION_PLACEHOLDER = '{task}';

export function isVerifySignalCondition(condition: string): boolean {
  return VERIFY_SIGNALS.has(condition.trim());
}

export function extractRuleConditions(
  rules: ReadonlyArray<{ condition?: string; when?: string }> | undefined,
): string[] {
  return (rules ?? [])
    .map((rule) => (rule.condition ?? rule.when ?? '').trim())
    .filter((condition) => condition.length > 0);
}

/** Verify steps must branch on both machine pass and fail signals. */
export function hasRequiredVerifyRuleSignals(conditions: readonly string[]): boolean {
  const set = new Set(conditions.map((condition) => condition.trim()));
  return set.has(VERIFY_SIGNAL_PASS) && set.has(VERIFY_SIGNAL_FAIL);
}

export function hasMeaningfulPersona(persona: unknown): boolean {
  return typeof persona === 'string' && persona.trim().length > 0;
}

export function hasMeaningfulInstruction(instruction: unknown): boolean {
  if (typeof instruction !== 'string') {
    return false;
  }
  const trimmed = instruction.trim();
  return trimmed.length > 0 && trimmed !== VERIFY_DEFAULT_INSTRUCTION_PLACEHOLDER;
}

/**
 * True when the step has verify config and no persona or non-placeholder instruction.
 * Used by YAML schema, step normalizer, and runtime executor.
 */
export function isVerifyOnlyAgentFields(input: {
  verify?: unknown;
  persona?: unknown;
  instruction?: unknown;
}): boolean {
  if (input.verify === undefined || input.verify === null) {
    return false;
  }
  if (hasMeaningfulPersona(input.persona)) {
    return false;
  }
  if (hasMeaningfulInstruction(input.instruction)) {
    return false;
  }
  return true;
}

/** True when verify is combined with persona or a real instruction (unsupported hybrid). */
export function isHybridVerifyAgentStep(input: {
  verify?: unknown;
  persona?: unknown;
  instruction?: unknown;
}): boolean {
  if (input.verify === undefined || input.verify === null) {
    return false;
  }
  return !isVerifyOnlyAgentFields(input);
}

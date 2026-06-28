import type { WorkflowState, WorkflowStep } from '../../models/types.js';
import {
  isVerifySignalCondition,
  VERIFY_SIGNAL_FAIL,
  VERIFY_SIGNAL_PASS,
} from '../../models/verify-step-contract.js';

export { isVerifySignalCondition };

export function evaluateVerifySignalCondition(
  condition: string,
  step: WorkflowStep,
  state: WorkflowState,
): boolean | null {
  const trimmed = condition.trim();
  if (!isVerifySignalCondition(trimmed)) {
    return null;
  }

  const context = state.systemContexts.get(step.name) as { verify_pass?: boolean } | undefined;
  const passed = context?.verify_pass === true;
  if (trimmed === VERIFY_SIGNAL_PASS) {
    return passed;
  }
  return !passed;
}

import type { WorkflowStep } from '../../models/types.js';
import { isVerifyOnlyAgentFields } from '../../models/verify-step-contract.js';
import { isSystemWorkflowStep, isWorkflowCallStep } from '../step-kind.js';

export function isVerifyOnlyStep(step: WorkflowStep): boolean {
  if (isSystemWorkflowStep(step) || isWorkflowCallStep(step)) {
    return false;
  }

  return isVerifyOnlyAgentFields({
    verify: step.verify,
    persona: step.persona,
    instruction: step.instruction,
  });
}

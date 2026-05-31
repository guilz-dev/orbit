/**
 * Shared workflow context for interactive mode (CLI and headless).
 */

import { getWorkflowDescription } from '../../infra/config/index.js';
import { type WorkflowContext } from './interactive.js';
import { loadTaskHistory } from './taskHistory.js';

export interface BuildInteractiveWorkflowContextOptions {
  interactivePreviewSteps?: number;
}

/**
 * Build workflow context injected into interactive system/summary prompts.
 */
export function buildInteractiveWorkflowContext(
  cwd: string,
  workflowId: string,
  lang: 'en' | 'ja',
  options: BuildInteractiveWorkflowContextOptions = {},
): WorkflowContext {
  const previewCount = options.interactivePreviewSteps;
  const workflowDesc = getWorkflowDescription(workflowId, cwd, previewCount);

  return {
    name: workflowDesc.name,
    description: workflowDesc.description,
    workflowStructure: workflowDesc.workflowStructure,
    stepPreviews: workflowDesc.stepPreviews,
    taskHistory: loadTaskHistory(cwd, lang),
  };
}

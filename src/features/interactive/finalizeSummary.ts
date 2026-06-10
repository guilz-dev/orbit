/**
 * Shared finalize (summary) logic for interactive mode — used by TTY loop and headless API.
 */

import { getLabel } from '../../shared/i18n/index.js';
import { callAIWithRetry, type SessionContext } from './aiCaller.js';
import {
  buildSummaryPrompt,
  type ConversationMessage,
  type WorkflowContext,
} from './interactive.js';
import type { ProviderImageAttachment } from '../../infra/providers/types.js';

export function resolveGoSummaryInput(
  history: ConversationMessage[],
  hasSessionContext: boolean,
  hasSourceContext: boolean,
  inlineTaskText: string,
): { summaryHistory: ConversationMessage[]; userNote: string } {
  if (history.length > 0 || hasSessionContext || hasSourceContext || !inlineTaskText) {
    return {
      summaryHistory: history,
      userNote: inlineTaskText,
    };
  }

  return {
    summaryHistory: [{ role: 'user', content: inlineTaskText }],
    userNote: '',
  };
}

export interface RunFinalizeSummaryInput {
  cwd: string;
  ctx: SessionContext;
  history: ConversationMessage[];
  sourceContext?: string;
  userNote?: string;
  workflowContext?: WorkflowContext;
  allowedTools: string[];
  summaryPromptContext?: string;
  providerSessionId?: string;
  imageAttachments?: ProviderImageAttachment[];
}

export type RunFinalizeSummaryResult =
  | { ok: true; task: string }
  | { ok: false; reason: 'no_conversation' | 'summarize_failed' | 'ai_error'; detail?: string };

/**
 * Build summary prompt and run the dedicated summary AI call (no inherited provider session).
 */
export async function runFinalizeSummary(
  input: RunFinalizeSummaryInput,
): Promise<RunFinalizeSummaryResult> {
  const { summaryHistory, userNote } = resolveGoSummaryInput(
    input.history,
    !!input.providerSessionId,
    !!input.sourceContext,
    input.userNote ?? '',
  );

  const lang = input.ctx.lang;
  const noTranscript = getLabel('interactive.noTranscript', lang);
  const conversationLabel = getLabel('interactive.conversationLabel', lang);

  let summaryPrompt = buildSummaryPrompt(
    summaryHistory,
    !!input.providerSessionId,
    lang,
    noTranscript,
    conversationLabel,
    input.workflowContext,
    input.sourceContext,
    input.summaryPromptContext,
  );

  if (!summaryPrompt) {
    return { ok: false, reason: 'no_conversation' };
  }

  if (userNote) {
    summaryPrompt = `${summaryPrompt}\n\nUser Note:\n${userNote}`;
  }

  const { result: summaryResult } = await callAIWithRetry(
    summaryPrompt,
    summaryPrompt,
    input.allowedTools,
    input.cwd,
    { ...input.ctx, sessionId: undefined },
    { imageAttachments: input.imageAttachments },
  );

  if (!summaryResult) {
    return { ok: false, reason: 'summarize_failed' };
  }

  if (!summaryResult.success) {
    return { ok: false, reason: 'ai_error', detail: summaryResult.content };
  }

  return { ok: true, task: summaryResult.content.trim() };
}

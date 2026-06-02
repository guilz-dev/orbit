/**
 * Headless interactive session API (non-TTY). Shares prompts and finalize logic with CLI interactive mode.
 */

import { resolveConfigValues } from '../../infra/config/index.js';
import type { ProviderType } from '../../infra/providers/index.js';
import { loadTemplate } from '../../shared/prompts/index.js';
import { callAIWithRetry, type SessionContext } from './aiCaller.js';
import {
  createHeadlessStreamSink,
  isHeadlessStreamEnabled,
} from './headlessStreamSink.js';
import { runFinalizeSummary } from './finalizeSummary.js';
import { loadAssistantInitContext } from './assistantInitFiles.js';
import { formatStepPreviews, type ConversationMessage } from './interactive.js';
import type {
  HeadlessAcceptResult,
  HeadlessFinalizePayload,
  HeadlessFinalizeResult,
  HeadlessInteractiveSnapshot,
  HeadlessPlayPayload,
  HeadlessPlayResult,
  HeadlessStartPayload,
  HeadlessStartResult,
  HeadlessTurnPayload,
  HeadlessTurnResult,
} from './headlessSession.types.js';
import { resolveHeadlessAllowedTools } from './headlessTools.js';
import { buildInteractivePolicyPrompt } from './policyPrompt.js';
import { prependInitialPromptContext } from './promptSections.js';
import { initializeSession } from './sessionInitialization.js';
import { buildInteractiveWorkflowContext } from './workflow-context.js';

export type {
  HeadlessAcceptResult,
  HeadlessFinalizePayload,
  HeadlessFinalizeResult,
  HeadlessInteractiveSnapshot,
  HeadlessPlayPayload,
  HeadlessPlayResult,
  HeadlessStartPayload,
  HeadlessStartResult,
  HeadlessTurnPayload,
  HeadlessTurnResult,
} from './headlessSession.types.js';

export { resolveHeadlessAllowedTools, READONLY_HEADLESS_TOOLS } from './headlessTools.js';

function findLatestAssistantMessage(
  history: ConversationMessage[],
): ConversationMessage | undefined {
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const message = history[i];
    if (message?.role === 'assistant') {
      return message;
    }
  }
  return undefined;
}

function buildSystemPrompt(
  cwd: string,
  lang: 'en' | 'ja',
  snapshot: Pick<HeadlessInteractiveSnapshot, 'workflowContext'>,
): string {
  const hasPreview = !!snapshot.workflowContext.stepPreviews?.length;
  return loadTemplate('score_interactive_system_prompt', lang, {
    hasWorkflowPreview: hasPreview,
    workflowStructure: snapshot.workflowContext.workflowStructure ?? '',
    stepDetails: hasPreview
      ? formatStepPreviews(snapshot.workflowContext.stepPreviews!, lang)
      : '',
    hasRunSession: false,
    runTask: '',
    runWorkflow: '',
    runStatus: '',
    runStepLogs: '',
    runReports: '',
  });
}

function createSessionContext(
  snapshot: HeadlessInteractiveSnapshot,
): SessionContext {
  const base = initializeSession(snapshot.cwd, 'interactive', {
    provider: snapshot.provider as ProviderType,
    model: snapshot.model,
  });
  return {
    ...base,
    lang: snapshot.lang,
    sessionId: snapshot.providerSessionId,
  };
}

async function callAssistant(
  snapshot: HeadlessInteractiveSnapshot,
  userMessage: string,
  isFirstTurn: boolean,
): Promise<{ snapshot: HeadlessInteractiveSnapshot; content?: string; error?: string }> {
  const ctx = createSessionContext(snapshot);
  const promptWithTransform = prependInitialPromptContext(
    buildInteractivePolicyPrompt(ctx.lang, userMessage, snapshot.sourceContext),
    isFirstTurn ? snapshot.assistantInitContext : undefined,
  );

  const streamSink = isHeadlessStreamEnabled()
    ? createHeadlessStreamSink(snapshot.planetzSessionId)
    : null;

  let callResult: Awaited<ReturnType<typeof callAIWithRetry>>;
  try {
    callResult = await callAIWithRetry(
      promptWithTransform,
      snapshot.systemPrompt,
      snapshot.allowedTools,
      snapshot.cwd,
      ctx,
      streamSink ? { onStream: streamSink.onStream } : undefined,
    );
    if (callResult.result?.success) {
      streamSink?.finish();
    } else {
      streamSink?.finish({ aborted: true });
    }
  } catch (error) {
    streamSink?.finish({ aborted: true });
    throw error;
  }

  const { result, sessionId: newProviderSessionId } = callResult;

  const next: HeadlessInteractiveSnapshot = {
    ...snapshot,
    providerSessionId: newProviderSessionId ?? snapshot.providerSessionId,
    updatedAt: new Date().toISOString(),
  };

  if (!result) {
    return { snapshot: next, error: 'AI call returned no result' };
  }
  if (!result.success) {
    return { snapshot: next, error: result.content };
  }

  next.messages = [...next.messages, { role: 'assistant', content: result.content }];
  return { snapshot: next, content: result.content };
}

/**
 * Start a new headless interactive session (assistant mode).
 */
export async function headlessInteractiveStart(
  input: HeadlessStartPayload,
): Promise<{ snapshot: HeadlessInteractiveSnapshot; result: HeadlessStartResult }> {
  const globalConfig = resolveConfigValues(input.cwd, ['language', 'interactivePreviewSteps']);
  const lang = globalConfig.language === 'ja' ? 'ja' : 'en';
  const workflowId = input.workflow;

  const workflowContext = buildInteractiveWorkflowContext(input.cwd, workflowId, lang, {
    interactivePreviewSteps: globalConfig.interactivePreviewSteps,
  });

  const baseCtx = initializeSession(input.cwd, 'interactive', {
    provider: input.provider as ProviderType | undefined,
    model: input.model,
  });

  let snapshot: HeadlessInteractiveSnapshot = {
    planetzSessionId: input.planetzSessionId,
    cwd: input.cwd,
    workflowId,
    provider: baseCtx.providerType,
    model: baseCtx.model,
    lang,
    messages: [],
    sourceContext: input.seed?.sourceContext,
    workflowContext,
    assistantInitContext: loadAssistantInitContext(input.cwd),
    systemPrompt: '',
    allowedTools: resolveHeadlessAllowedTools(input.toolsProfile),
    updatedAt: new Date().toISOString(),
  };

  snapshot.systemPrompt = buildSystemPrompt(input.cwd, lang, snapshot);

  const seedMessage = input.seed?.userMessage?.trim();
  if (!seedMessage) {
    return {
      snapshot,
      result: { kind: 'assistant_message', assistantMessage: '' },
    };
  }

  snapshot.messages.push({ role: 'user', content: seedMessage });
  const called = await callAssistant(snapshot, seedMessage, true);
  snapshot = called.snapshot;

  if (called.error) {
    snapshot.messages.pop();
    return { snapshot, result: { kind: 'error', error: called.error } };
  }

  return {
    snapshot,
    result: { kind: 'assistant_message', assistantMessage: called.content ?? '' },
  };
}

/**
 * Send a user turn in an existing headless session.
 */
export async function headlessInteractiveTurn(
  snapshot: HeadlessInteractiveSnapshot,
  payload: HeadlessTurnPayload,
): Promise<{ snapshot: HeadlessInteractiveSnapshot; result: HeadlessTurnResult }> {
  const trimmed = payload.message.trim();
  if (!trimmed) {
    return { snapshot, result: { kind: 'error', error: 'Message must not be empty' } };
  }

  let next: HeadlessInteractiveSnapshot = {
    ...snapshot,
    messages: [...snapshot.messages, { role: 'user', content: trimmed }],
    updatedAt: new Date().toISOString(),
  };

  const isFirstAiTurn = !snapshot.messages.some((m) => m.role === 'assistant');

  const called = await callAssistant(next, trimmed, isFirstAiTurn);
  next = called.snapshot;

  if (called.error) {
    next = {
      ...next,
      messages: next.messages.slice(0, -1),
    };
    return { snapshot: next, result: { kind: 'error', error: called.error } };
  }

  return {
    snapshot: next,
    result: { kind: 'assistant_message', assistantMessage: called.content ?? '' },
  };
}

/**
 * Finalize conversation into a task instruction (headless equivalent of CLI /go flow).
 */
export async function headlessInteractiveFinalize(
  snapshot: HeadlessInteractiveSnapshot,
  payload: HeadlessFinalizePayload = {},
): Promise<{ snapshot: HeadlessInteractiveSnapshot; result: HeadlessFinalizeResult }> {
  const ctx = createSessionContext(snapshot);
  const finalizeResult = await runFinalizeSummary({
    cwd: snapshot.cwd,
    ctx,
    history: snapshot.messages,
    sourceContext: snapshot.sourceContext,
    userNote: payload.note,
    workflowContext: snapshot.workflowContext,
    allowedTools: snapshot.allowedTools,
    summaryPromptContext: snapshot.assistantInitContext,
    providerSessionId: snapshot.providerSessionId,
  });

  const next: HeadlessInteractiveSnapshot = {
    ...snapshot,
    updatedAt: new Date().toISOString(),
  };

  if (!finalizeResult.ok) {
    return {
      snapshot: next,
      result: {
        kind: 'error',
        error: finalizeResult.detail ?? finalizeResult.reason,
        reason: finalizeResult.reason,
      },
    };
  }

  return {
    snapshot: next,
    result: {
      kind: 'summary',
      task: finalizeResult.task,
      allowedActions: ['execute', 'save_task', 'continue'],
    },
  };
}

/**
 * Accept the latest assistant message as the task (headless /accept).
 */
export function headlessInteractiveAccept(
  snapshot: HeadlessInteractiveSnapshot,
): { snapshot: HeadlessInteractiveSnapshot; result: HeadlessAcceptResult } {
  const assistantMessage = findLatestAssistantMessage(snapshot.messages);
  if (!assistantMessage) {
    return {
      snapshot,
      result: { kind: 'error', error: 'No assistant message to accept' },
    };
  }

  return {
    snapshot: {
      ...snapshot,
      updatedAt: new Date().toISOString(),
    },
    result: {
      kind: 'accept',
      task: assistantMessage.content,
      allowedActions: ['execute', 'save_task'],
    },
  };
}

/**
 * Use explicit task text as the instruction (headless /play).
 */
export function headlessInteractivePlay(
  snapshot: HeadlessInteractiveSnapshot,
  payload: HeadlessPlayPayload,
): { snapshot: HeadlessInteractiveSnapshot; result: HeadlessPlayResult } {
  const task = payload.task.trim();
  if (!task) {
    return {
      snapshot,
      result: { kind: 'error', error: 'Task must not be empty' },
    };
  }

  return {
    snapshot: {
      ...snapshot,
      updatedAt: new Date().toISOString(),
    },
    result: {
      kind: 'play',
      task,
      allowedActions: ['execute', 'save_task'],
    },
  };
}

/** Mark session cancelled (stateless; caller drops snapshot). */
export function headlessInteractiveCancel(
  snapshot: HeadlessInteractiveSnapshot,
): HeadlessInteractiveSnapshot {
  return { ...snapshot, updatedAt: new Date().toISOString() };
}

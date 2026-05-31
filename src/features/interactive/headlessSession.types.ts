import type { ConversationMessage, WorkflowContext } from './interactive.js';

export type HeadlessInteractiveSessionMode = 'assistant';

export type HeadlessToolsProfile = 'readonly' | 'orbit-default';

export interface HeadlessInteractiveSnapshot {
  planetzSessionId: string;
  providerSessionId?: string;
  cwd: string;
  workflowId: string;
  provider: string;
  model?: string;
  lang: 'en' | 'ja';
  messages: ConversationMessage[];
  sourceContext?: string;
  workflowContext: WorkflowContext;
  assistantInitContext?: string;
  systemPrompt: string;
  allowedTools: string[];
  updatedAt: string;
}

export interface HeadlessStartPayload {
  cwd: string;
  workflow: string;
  planetzSessionId: string;
  provider?: string;
  model?: string;
  seed?: { userMessage?: string; sourceContext?: string };
  toolsProfile?: HeadlessToolsProfile;
}

export interface HeadlessTurnPayload {
  message: string;
}

export interface HeadlessFinalizePayload {
  note?: string;
}

export type HeadlessStartResult =
  | { kind: 'assistant_message'; assistantMessage: string }
  | { kind: 'error'; error: string };

export type HeadlessTurnResult =
  | { kind: 'assistant_message'; assistantMessage: string }
  | { kind: 'error'; error: string };

export type HeadlessFinalizeResult =
  | {
      kind: 'summary';
      task: string;
      allowedActions: Array<'execute' | 'save_task' | 'continue'>;
    }
  | { kind: 'error'; error: string; reason?: string };

export type HeadlessAcceptResult =
  | {
      kind: 'accept';
      task: string;
      allowedActions: Array<'execute' | 'save_task'>;
    }
  | { kind: 'error'; error: string };

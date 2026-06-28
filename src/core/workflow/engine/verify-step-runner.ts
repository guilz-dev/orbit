import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { AgentResponse, WorkflowState, WorkflowStep } from '../../models/types.js';
import type { WorkflowVerifyConfig } from '../../models/workflow-types.js';
import { detectMatchedRule } from '../evaluation/index.js';
import type { RuleEvaluatorContext } from '../evaluation/RuleEvaluator.js';
import { isVerifyOnlyStep } from './verify-step-utils.js';

const execAsync = promisify(exec);

/** Max captured verify stdout/stderr chars stored in workflow state. */
const VERIFY_LOG_CAPTURE_LIMIT = 4000;

export interface VerifyCommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

/**
 * Runs verify.command in a shell under cwd.
 * Workflow authors are trusted; do not point verify at untrusted YAML sources.
 */
export async function runVerifyCommand(
  command: string,
  cwd: string,
): Promise<VerifyCommandResult> {
  try {
    const result = await execAsync(command, {
      cwd,
      timeout: 600_000,
      env: process.env,
    });
    return {
      exitCode: 0,
      stdout: result.stdout ?? '',
      stderr: result.stderr ?? '',
    };
  } catch (error: unknown) {
    const execError = error as { code?: number; stdout?: string; stderr?: string };
    return {
      exitCode: typeof execError.code === 'number' ? execError.code : 1,
      stdout: execError.stdout ?? '',
      stderr: execError.stderr ?? '',
    };
  }
}

export function resolveVerifyPass(
  verify: WorkflowVerifyConfig,
  result: VerifyCommandResult,
): boolean {
  const commandSucceeded = result.exitCode === 0;
  return verify.expect === 'pass' ? commandSucceeded : !commandSucceeded;
}

export function storeVerifyContext(
  state: WorkflowState,
  stepName: string,
  verify: WorkflowVerifyConfig,
  result: VerifyCommandResult,
): void {
  const verifyPass = resolveVerifyPass(verify, result);
  state.systemContexts.set(stepName, {
    verify_pass: verifyPass,
    exit_code: result.exitCode,
    command: verify.command,
    expect: verify.expect,
    stdout: result.stdout.slice(0, VERIFY_LOG_CAPTURE_LIMIT),
    stderr: result.stderr.slice(0, VERIFY_LOG_CAPTURE_LIMIT),
  });
}

export async function runVerifyOnlyStep(
  step: WorkflowStep,
  state: WorkflowState,
  cwd: string,
  ruleContext: Omit<RuleEvaluatorContext, 'state'>,
): Promise<AgentResponse> {
  if (!step.verify) {
    throw new Error(`Verify-only step "${step.name}" is missing verify configuration`);
  }
  if (!isVerifyOnlyStep(step)) {
    throw new Error(`Step "${step.name}" is not a verify-only step`);
  }

  const result = await runVerifyCommand(step.verify.command, cwd);
  storeVerifyContext(state, step.name, step.verify, result);

  const match = await detectMatchedRule(step, '', '', {
    ...ruleContext,
    state,
  });

  const response: AgentResponse = {
    persona: step.name,
    status: 'done',
    content: [
      `Verify step "${step.name}" completed.`,
      `exit_code=${result.exitCode}`,
      `verify_pass=${resolveVerifyPass(step.verify, result)}`,
    ].join('\n'),
    timestamp: new Date(),
    matchedRuleIndex: match?.index,
    matchedRuleMethod: match?.method,
  };

  state.stepOutputs.set(step.name, response);
  state.lastOutput = response;
  return response;
}

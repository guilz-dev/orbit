/**
 * NDJSON stream lines on stderr for Planetz desktop (adjunct to stdout contract v1).
 * Enabled when PLANETZ_HEADLESS_STREAM=1 (injected by orbit-interactive-client).
 */

import type { StreamCallback, StreamEvent } from '../../shared/types/provider.js';

/** Must stay in sync with Planetz `ORBIT_INTERACTIVE_STREAM_PROTOCOL_VERSION` (stderr adjunct). */
export const HEADLESS_STREAM_PROTOCOL_VERSION = 1;

const FORWARDED_EVENT_TYPES = new Set<StreamEvent['type']>([
  'init',
  'text',
  'thinking',
  'tool_use',
  'tool_result',
  'tool_output',
  'error',
  'assistant_error',
  'result',
  'rate_limit',
]);

export function isHeadlessStreamEnabled(): boolean {
  return process.env.PLANETZ_HEADLESS_STREAM === '1';
}

export interface HeadlessStreamSink {
  onStream: StreamCallback;
  /** Emit terminal `done` line (optional aborted flag for cancel). */
  finish: (options?: { aborted?: boolean }) => void;
}

export function createHeadlessStreamSink(sessionId: string): HeadlessStreamSink {
  let seq = 0;

  const writeLine = (payload: Record<string, unknown>): void => {
    seq += 1;
    const line = JSON.stringify({
      v: HEADLESS_STREAM_PROTOCOL_VERSION,
      sessionId,
      seq,
      ...payload,
    });
    process.stderr.write(`${line}\n`);
  };

  const onStream: StreamCallback = (event) => {
    if (!FORWARDED_EVENT_TYPES.has(event.type)) return;
    writeLine({ event });
  };

  const finish = (options?: { aborted?: boolean }): void => {
    writeLine(options?.aborted ? { done: true, aborted: true } : { done: true });
  };

  return { onStream, finish };
}

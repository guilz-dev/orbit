import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createHeadlessStreamSink,
  isHeadlessStreamEnabled,
} from '../features/interactive/headlessStreamSink.js';

describe('headlessStreamSink', () => {
  const originalEnv = process.env.PLANETZ_HEADLESS_STREAM;
  let stderrChunks: string[];

  beforeEach(() => {
    stderrChunks = [];
    vi.spyOn(process.stderr, 'write').mockImplementation((chunk: string | Uint8Array) => {
      stderrChunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8'));
      return true;
    });
  });

  afterEach(() => {
    process.env.PLANETZ_HEADLESS_STREAM = originalEnv;
    vi.restoreAllMocks();
  });

  it('isHeadlessStreamEnabled reflects env', () => {
    process.env.PLANETZ_HEADLESS_STREAM = '1';
    expect(isHeadlessStreamEnabled()).toBe(true);
    delete process.env.PLANETZ_HEADLESS_STREAM;
    expect(isHeadlessStreamEnabled()).toBe(false);
  });

  it('writes NDJSON lines for forwarded stream events in order', () => {
    const sink = createHeadlessStreamSink('composer_test');
    sink.onStream({ type: 'init', data: { model: 'm', sessionId: 's1' } });
    sink.onStream({ type: 'text', data: { text: 'hi' } });
    sink.finish();

    const lines = stderrChunks.join('').trim().split('\n').filter(Boolean);
    expect(lines).toHaveLength(3);

    const parsed = lines.map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(parsed[0]).toMatchObject({ v: 1, sessionId: 'composer_test', seq: 1 });
    expect(parsed[1]).toMatchObject({ seq: 2, event: { type: 'text', data: { text: 'hi' } } });
    expect(parsed[2]).toMatchObject({ seq: 3, done: true });
  });

  it('finish with aborted sets aborted flag', () => {
    const sink = createHeadlessStreamSink('composer_abort');
    sink.finish({ aborted: true });
    const line = JSON.parse(stderrChunks.join('').trim()) as Record<string, unknown>;
    expect(line).toMatchObject({ done: true, aborted: true });
  });

  it('ignores stream event types outside the forward list', () => {
    const sink = createHeadlessStreamSink('composer_filter');
    sink.onStream({ type: 'custom', data: {} } as Parameters<typeof sink.onStream>[0]);
    sink.finish();

    const lines = stderrChunks.join('').trim().split('\n').filter(Boolean);
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0] as string)).toMatchObject({ done: true });
  });

  it('does not write stream lines when headlessSession would skip the sink (env off)', () => {
    delete process.env.PLANETZ_HEADLESS_STREAM;
    const streamSink = isHeadlessStreamEnabled() ? createHeadlessStreamSink('composer_off') : null;
    expect(streamSink).toBeNull();
    expect(stderrChunks.join('')).toBe('');
  });
});

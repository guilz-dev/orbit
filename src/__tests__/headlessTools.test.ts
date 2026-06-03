import { describe, expect, it } from 'vitest';
import {
  normalizeHeadlessToolsProfile,
  resolveHeadlessAllowedTools,
} from '../features/interactive/headlessTools.js';

describe('headlessTools', () => {
  it('maps legacy readonly alias to planetz-readonly tools', () => {
    expect(normalizeHeadlessToolsProfile('readonly')).toBe('planetz-readonly');
    expect(resolveHeadlessAllowedTools('readonly')).toEqual([
      'Read',
      'Glob',
      'Grep',
      'WebSearch',
      'WebFetch',
    ]);
  });

  it('includes Bash for planetz-investigate profile', () => {
    expect(resolveHeadlessAllowedTools('planetz-investigate')).toEqual([
      'Read',
      'Glob',
      'Grep',
      'WebSearch',
      'WebFetch',
      'Bash',
    ]);
  });
});

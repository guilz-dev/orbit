import { DEFAULT_INTERACTIVE_TOOLS } from './interactive.js';
import type { HeadlessToolsProfile } from './headlessSession.types.js';

/** Read-only tools for Planetz headless Phase 1 default. */
export const READONLY_HEADLESS_TOOLS = ['Read', 'Glob', 'Grep', 'WebSearch', 'WebFetch'] as const;

export function resolveHeadlessAllowedTools(profile: HeadlessToolsProfile | undefined): string[] {
  if (profile === 'orbit-default') {
    return [...DEFAULT_INTERACTIVE_TOOLS];
  }
  return [...READONLY_HEADLESS_TOOLS];
}

import { DEFAULT_INTERACTIVE_TOOLS } from './interactive.js';
import type { HeadlessToolsProfile } from './headlessSession.types.js';

/** Read-only tools for Planetz headless Phase 1 default. */
export const READONLY_HEADLESS_TOOLS = ['Read', 'Glob', 'Grep', 'WebSearch', 'WebFetch'] as const;

const INVESTIGATE_HEADLESS_TOOLS = [...READONLY_HEADLESS_TOOLS, 'Bash'] as const;

/** Legacy aliases map to Planetz-named profiles. */
export function normalizeHeadlessToolsProfile(
  profile: HeadlessToolsProfile | undefined,
): HeadlessToolsProfile {
  if (profile === 'readonly') return 'planetz-readonly';
  if (profile === 'orbit-default') return 'planetz-orbit-default';
  if (!profile) return 'planetz-readonly';
  return profile;
}

export function resolveHeadlessAllowedTools(profile: HeadlessToolsProfile | undefined): string[] {
  const normalized = normalizeHeadlessToolsProfile(profile);
  switch (normalized) {
    case 'planetz-orbit-default':
      return [...DEFAULT_INTERACTIVE_TOOLS];
    case 'planetz-investigate':
    case 'planetz-agent-edit':
      return [...INVESTIGATE_HEADLESS_TOOLS];
    case 'planetz-readonly':
    default:
      return [...READONLY_HEADLESS_TOOLS];
  }
}

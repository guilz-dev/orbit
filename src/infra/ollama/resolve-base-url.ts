import type { StepProviderOptions } from '../../core/models/workflow-provider-options.js';

/** Fallback when Planetz does not set `OLLAMA_HOST`. */
export const DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434';

function normalizeOrigin(input: string): string {
  const raw = input.trim();
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `http://${raw}`;
  try {
    const url = new URL(withScheme);
    return `${url.protocol}//${url.host}`;
  } catch {
    return DEFAULT_OLLAMA_BASE_URL;
  }
}

export function resolveOllamaOrigin(
  providerOptions: StepProviderOptions | undefined,
  ollamaHostEnv: string | undefined,
): string {
  const fromOptions = providerOptions?.ollama?.baseUrl?.trim();
  if (fromOptions) {
    return normalizeOrigin(fromOptions);
  }
  const fromEnv = ollamaHostEnv?.trim();
  if (fromEnv) {
    if (/^https?:\/\//i.test(fromEnv)) {
      return normalizeOrigin(fromEnv);
    }
    return normalizeOrigin(`http://${fromEnv}`);
  }
  return DEFAULT_OLLAMA_BASE_URL;
}

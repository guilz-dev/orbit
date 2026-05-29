import type { ProviderCallOptions } from '../providers/types.js';

export interface OllamaCallOptions {
  cwd: string;
  abortSignal?: AbortSignal;
  model?: string;
  allowedTools?: string[];
  providerOptions?: ProviderCallOptions['providerOptions'];
  onStream?: ProviderCallOptions['onStream'];
}

/**
 * Ollama provider implementation
 */

import { callOllama, callOllamaCustom } from '../ollama/index.js';
import type { AgentResponse } from '../../core/models/index.js';
import type { AgentSetup, Provider, ProviderAgent, ProviderCallOptions } from './types.js';
import type { OllamaCallOptions } from '../ollama/types.js';

function toOllamaOptions(options: ProviderCallOptions): OllamaCallOptions {
  return {
    cwd: options.cwd,
    abortSignal: options.abortSignal,
    model: options.model,
    allowedTools: options.allowedTools,
    providerOptions: options.providerOptions,
    onStream: options.onStream,
  };
}

/** Ollama provider — local OpenAI-compatible HTTP API */
export class OllamaProvider implements Provider {
  readonly supportsStructuredOutput = false;

  setup(config: AgentSetup): ProviderAgent {
    const { name, systemPrompt } = config;
    if (systemPrompt) {
      return {
        call: async (prompt: string, options: ProviderCallOptions): Promise<AgentResponse> => {
          return callOllamaCustom(name, prompt, systemPrompt, toOllamaOptions(options));
        },
      };
    }

    return {
      call: async (prompt: string, options: ProviderCallOptions): Promise<AgentResponse> => {
        return callOllama(name, prompt, toOllamaOptions(options));
      },
    };
  }
}

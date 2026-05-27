const FORBIDDEN_CONFIG_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

export function sanitizeConfigValue(value: unknown, path: string): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) => sanitizeConfigValue(item, `${path}[${index}]`));
  }

  if (typeof value !== 'object' || value === null) {
    return value;
  }
  const record = value as Record<string, unknown>;

  const sanitized: Record<string, unknown> = {};
  for (const [key, nestedValue] of Object.entries(record)) {
    if (FORBIDDEN_CONFIG_KEYS.has(key)) {
      throw new Error(`Configuration error: forbidden key "${key}" at "${path}".`);
    }
    sanitized[key] = sanitizeConfigValue(nestedValue, `${path}.${key}`);
  }
  return sanitized;
}


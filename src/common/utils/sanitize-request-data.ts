type AnyObject = Record<string, unknown>

const SENSITIVE_KEYS = new Set([
  'password',
  'authorization',
  'cookie',
  'x-auth-token',
  'x-api-key',
  'token',
  'accessToken',
  'refreshToken',
  'access_token',
  'refresh_token',
  'secret',
  'apiKey',
])

export function sanitizeRequestData(
  data: AnyObject | AnyObject[],
): AnyObject | AnyObject[] {
  if (Array.isArray(data)) {
    return data.map(sanitizeRequestData) as AnyObject[]
  }

  return Object.fromEntries(
    Object.entries(data).filter(([key]) => !SENSITIVE_KEYS.has(key)),
  )
}

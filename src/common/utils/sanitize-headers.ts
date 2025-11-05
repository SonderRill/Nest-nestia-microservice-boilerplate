export function sanitizeHeaders(headers: any) {
  const { 'x-auth-token': _x_auth_token, cookie: _cookie, ...safe } = headers
  return {
    ...safe,
  }
}

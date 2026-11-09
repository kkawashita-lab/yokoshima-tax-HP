export async function onRequest({ request, next, env }) {
  const expected = 'Basic ' + btoa(`${env.BASIC_AUTH_USER}:${env.BASIC_AUTH_PASS}`);
  if (env.BASIC_AUTH_USER && env.BASIC_AUTH_PASS && request.headers.get('Authorization') === expected) {
    const response = await next();
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
  return new Response('認証が必要です', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="yokoshima", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

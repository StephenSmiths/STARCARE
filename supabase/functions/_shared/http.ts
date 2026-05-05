/** CORS 與 JSON 回應（Edge 與瀏覽器 fetch 相容；須含 X-Idempotency-Key 否則 preflight 失敗→Failed to fetch） */
export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-idempotency-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
}

export const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

export const emptyOk = (): Response => new Response('ok', { headers: corsHeaders })

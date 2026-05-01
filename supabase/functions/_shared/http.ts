/** CORS 與 JSON 回應（Edge 與瀏覽器 fetch 相容） */
export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

export const emptyOk = (): Response => new Response('ok', { headers: corsHeaders })

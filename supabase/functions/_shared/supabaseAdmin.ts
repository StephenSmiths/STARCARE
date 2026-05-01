import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

/** 使用 service role 操作資料庫（上線後請搭配 RLS 審慎收斂權限） */
export const getServiceClient = () => {
  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) {
    throw new Error('缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY')
  }
  return createClient(url, key)
}

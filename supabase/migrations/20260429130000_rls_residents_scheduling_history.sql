-- RLS：預設不建立 anon 政策時，僅 service_role（Edge 使用）可繞過 RLS 寫入；
-- authenticated 僅開放讀取未刪除院友，供日後接 Supabase Auth 直連查詢。

ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduling_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS residents_select_active ON public.residents;
CREATE POLICY residents_select_active
  ON public.residents
  FOR SELECT
  TO authenticated
  USING (is_deleted = false);

COMMENT ON POLICY residents_select_active ON public.residents IS '已登入使用者僅可讀未軟刪院友；寫入仍建議走 Edge';

-- 院友更新時自動刷新 updated_at
CREATE OR REPLACE FUNCTION public.set_residents_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_residents_updated_at ON public.residents;
CREATE TRIGGER trg_residents_updated_at
  BEFORE UPDATE ON public.residents
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_residents_updated_at();

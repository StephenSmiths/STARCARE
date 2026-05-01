-- STARCARE：可排時段主檔（由 Edge function 讀取，不再硬編碼）。
-- 欄位命名對齊前端 SchedulingSession（camelCase 對映於 Edge 完成）。

CREATE TABLE IF NOT EXISTS public.scheduling_sessions (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL,
  staff_name TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  service_type TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity >= 1),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheduling_sessions_is_deleted
  ON public.scheduling_sessions (is_deleted);
CREATE INDEX IF NOT EXISTS idx_scheduling_sessions_date
  ON public.scheduling_sessions (date);

COMMENT ON TABLE public.scheduling_sessions IS '智能排班可用時段清單；禁止硬刪，僅 is_deleted 軟刪';

-- 初始資料：與既有前端預設三節一致（僅當不存在時插入）
INSERT INTO public.scheduling_sessions (
  id, staff_id, staff_name, date, time_slot, service_type, capacity
)
VALUES
  ('session-1', 'staff-ot-1', '王姑娘 OT', '2026-04-30', '09:00-10:00', 'Subsidized_Rehab', 1),
  ('session-2', 'staff-ot-2', '李先生 PTA', '2026-05-02', '09:00-10:00', 'Subsidized_Rehab', 1),
  ('session-3', 'staff-ot-3', '張姑娘 OT', '2026-05-04', '14:00-15:00', 'Subsidized_Rehab', 1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.scheduling_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS scheduling_sessions_select_staff ON public.scheduling_sessions;
CREATE POLICY scheduling_sessions_select_staff
  ON public.scheduling_sessions
  FOR SELECT
  TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'admin')
    )
  );

COMMENT ON POLICY scheduling_sessions_select_staff ON public.scheduling_sessions
IS '直連查詢僅限 staff/admin；前端現階段仍由 Edge 讀取';

CREATE OR REPLACE FUNCTION public.set_scheduling_sessions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_scheduling_sessions_updated_at ON public.scheduling_sessions;
CREATE TRIGGER trg_scheduling_sessions_updated_at
  BEFORE UPDATE ON public.scheduling_sessions
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_scheduling_sessions_updated_at();

-- PDF 02【9】／01 §5：評估完成紀錄主檔（PostgreSQL）；禁止硬刪除；寫入後續經 Edge 擴充
-- 與前端 **`AssessmentCompletionRecord`**（`cycleAnchorDate`、`discipline` PT|OT）對齊

CREATE TABLE IF NOT EXISTS public.assessment_completion_records (
  id TEXT PRIMARY KEY,
  resident_id TEXT NOT NULL REFERENCES public.residents (id),
  resident_name TEXT NOT NULL,
  cycle_anchor_date DATE NOT NULL,
  discipline TEXT NOT NULL CHECK (discipline IN ('PT', 'OT')),
  version_label TEXT NOT NULL,
  recorded_by_actor_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_assessment_completion_active_discipline
  ON public.assessment_completion_records (resident_id, cycle_anchor_date, discipline)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_assessment_completion_resident
  ON public.assessment_completion_records (resident_id)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_assessment_completion_completed_at
  ON public.assessment_completion_records (completed_at DESC)
  WHERE is_deleted = false;

COMMENT ON TABLE public.assessment_completion_records IS
  '評估完成紀錄（PT／OT 版本）；軟刪 is_deleted；寫入預設僅 service_role（Edge）';

ALTER TABLE public.assessment_completion_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS assessment_completion_records_select_staff ON public.assessment_completion_records;
CREATE POLICY assessment_completion_records_select_staff
  ON public.assessment_completion_records
  FOR SELECT
  TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1
      FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

COMMENT ON POLICY assessment_completion_records_select_staff ON public.assessment_completion_records IS
  'SELECT：已登入 staff／teamlead／admin 可讀未軟刪列；寫入走 Edge';

CREATE OR REPLACE FUNCTION public.set_assessment_completion_records_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assessment_completion_records_updated_at ON public.assessment_completion_records;
CREATE TRIGGER trg_assessment_completion_records_updated_at
  BEFORE UPDATE ON public.assessment_completion_records
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_assessment_completion_records_updated_at();

-- STARCARE：院友主檔與排班歷史（上線前請補齊 RLS 與政策）
-- 資助類別術語：GradeA_Subsidized | Voucher | Private

CREATE TABLE IF NOT EXISTS public.residents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bed_number TEXT NOT NULL,
  area TEXT NOT NULL,
  gender TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 1 AND age <= 130),
  admission_date DATE NOT NULL,
  funding_type TEXT NOT NULL CHECK (funding_type IN ('GradeA_Subsidized', 'Voucher', 'Private')),
  service_type TEXT NOT NULL,
  dementia_level TEXT NOT NULL,
  is_special_care BOOLEAN NOT NULL DEFAULT false,
  health_condition TEXT NOT NULL DEFAULT '',
  medication_record TEXT NOT NULL DEFAULT '',
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_residents_is_deleted ON public.residents (is_deleted);
CREATE INDEX IF NOT EXISTS idx_residents_funding_type ON public.residents (funding_type);

COMMENT ON TABLE public.residents IS '院友主檔；禁止硬刪除，僅 is_deleted 軟刪';

CREATE TABLE IF NOT EXISTS public.scheduling_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  staff_id TEXT NOT NULL,
  pass INTEGER NOT NULL,
  service_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  batch_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_scheduling_history_batch ON public.scheduling_history (batch_id);
CREATE INDEX IF NOT EXISTS idx_scheduling_history_resident ON public.scheduling_history (resident_id);
CREATE INDEX IF NOT EXISTS idx_scheduling_history_created ON public.scheduling_history (created_at DESC);

COMMENT ON TABLE public.scheduling_history IS '智能排班一鍵儲存之歷史紀錄；禁止硬刪除';

-- 01 §2.2 服務表單（Seq 3／17）：PostgreSQL 持久化；寫入經 Edge；軟刪除
-- 爭議時以 docs/pdf/01-STARCare-核心業務邏輯與-SOP.pdf 為準

CREATE TABLE IF NOT EXISTS public.service_forms (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL DEFAULT 'facility-main',
  session_id TEXT NOT NULL,
  session_date DATE NOT NULL,
  staff_profile_id TEXT NOT NULL,
  resident_id TEXT NOT NULL,
  resident_name TEXT NOT NULL,
  narrative TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (
    status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED_NEEDS_REVISION')
  ),
  owner_actor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewer_actor_id TEXT,
  review_note TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_service_forms_facility ON public.service_forms (facility_id);
CREATE INDEX IF NOT EXISTS idx_service_forms_owner ON public.service_forms (owner_actor_id);
CREATE INDEX IF NOT EXISTS idx_service_forms_session ON public.service_forms (session_id);
CREATE INDEX IF NOT EXISTS idx_service_forms_updated ON public.service_forms (updated_at DESC);

COMMENT ON TABLE public.service_forms IS '服務紀錄表單；禁止硬刪除；RLS 預設僅 service_role（Edge）可寫';

ALTER TABLE public.service_forms ENABLE ROW LEVEL SECURITY;

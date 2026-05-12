-- PDF 02【16】院舍政策：版本化骨架（多表 + effective_from）— 表與觸發器
-- RLS 見 **下一支** migration：`20260509153100_facility_scheduling_policy_versioned_rls.sql`
-- 對照：docs/system-settings-policy-prd-2026-05-09.md、docs/system-settings-policy-schema-2026-05-09.md

CREATE TABLE IF NOT EXISTS public.facility_scheduling_policy_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id TEXT NOT NULL REFERENCES public.facilities (id) ON DELETE RESTRICT,
  effective_from TIMESTAMPTZ NOT NULL,
  effective_until TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'active', 'superseded')),
  change_summary TEXT NOT NULL DEFAULT '',
  created_by_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT facility_policy_versions_effective_window_chk CHECK (
    effective_until IS NULL OR effective_until > effective_from
  )
);

COMMENT ON TABLE public.facility_scheduling_policy_versions IS
  '院舍排班／復康政策版本頭表；effective_from 起算；effective_until 由新版啟用時回填；與 scheduling_rules 並存至接軌完成。';

CREATE INDEX IF NOT EXISTS idx_facility_policy_versions_facility_from
  ON public.facility_scheduling_policy_versions (facility_id, effective_from DESC);

CREATE UNIQUE INDEX IF NOT EXISTS uq_facility_policy_one_active
  ON public.facility_scheduling_policy_versions (facility_id)
  WHERE status = 'active';

DROP TRIGGER IF EXISTS trg_facility_scheduling_policy_versions_updated_at
  ON public.facility_scheduling_policy_versions;
CREATE TRIGGER trg_facility_scheduling_policy_versions_updated_at
  BEFORE UPDATE ON public.facility_scheduling_policy_versions
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_now();

CREATE TABLE IF NOT EXISTS public.facility_policy_non_therapy_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version_id UUID NOT NULL
    REFERENCES public.facility_scheduling_policy_versions (id) ON DELETE CASCADE,
  slot_kind TEXT NOT NULL
    CHECK (slot_kind IN ('LUNCH', 'MORNING_DOC', 'AFTERNOON_DOC', 'OTHER', 'SHIFT_PREP_BLOCK')),
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT facility_policy_non_therapy_time_order_chk CHECK (time_end > time_start)
);

COMMENT ON TABLE public.facility_policy_non_therapy_slots IS
  '非治療時段；SHIFT_PREP_BLOCK 表示開工準備時段（業務上對應「開工後 30 分鐘」開關與長度，長度可另欄擴充）。';

CREATE TABLE IF NOT EXISTS public.facility_policy_numeric_limits (
  policy_version_id UUID PRIMARY KEY
    REFERENCES public.facility_scheduling_policy_versions (id) ON DELETE CASCADE,
  therapist_group_sessions_daily_cap INTEGER NOT NULL DEFAULT 8
    CHECK (therapist_group_sessions_daily_cap >= 0),
  assistant_group_sessions_daily_cap INTEGER NOT NULL DEFAULT 8
    CHECK (assistant_group_sessions_daily_cap >= 0),
  group_participant_cap INTEGER NOT NULL DEFAULT 6
    CHECK (group_participant_cap >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.facility_policy_numeric_limits IS
  '排班規則數值上限（每版本至多一列）；預設值僅供骨架，接軌時與現行 scheduling_rules 對齊。';

DROP TRIGGER IF EXISTS trg_facility_policy_numeric_limits_updated_at
  ON public.facility_policy_numeric_limits;
CREATE TRIGGER trg_facility_policy_numeric_limits_updated_at
  BEFORE UPDATE ON public.facility_policy_numeric_limits
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_now();

CREATE TABLE IF NOT EXISTS public.facility_policy_fixed_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version_id UUID NOT NULL
    REFERENCES public.facility_scheduling_policy_versions (id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('Subsidized_Rehab', 'Dementia_Care')),
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('Individual', 'Group')),
  activity_name TEXT NOT NULL DEFAULT '',
  role_pt BOOLEAN NOT NULL DEFAULT false,
  role_pta BOOLEAN NOT NULL DEFAULT false,
  role_ot BOOLEAN NOT NULL DEFAULT false,
  role_ota BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT facility_policy_fixed_activities_time_order_chk CHECK (time_end > time_start)
);

CREATE TABLE IF NOT EXISTS public.facility_policy_subsidized_tier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version_id UUID NOT NULL
    REFERENCES public.facility_scheduling_policy_versions (id) ON DELETE CASCADE,
  funding_tier TEXT NOT NULL CHECK (funding_tier IN ('GradeA_Subsidized', 'Voucher', 'Private')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  weekly_min_sessions INTEGER NOT NULL DEFAULT 0 CHECK (weekly_min_sessions >= 0),
  special_care_therapist_only BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (policy_version_id, funding_tier)
);

CREATE TABLE IF NOT EXISTS public.facility_policy_subsidized_role_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version_id UUID NOT NULL
    REFERENCES public.facility_scheduling_policy_versions (id) ON DELETE CASCADE,
  funding_tier TEXT NOT NULL CHECK (funding_tier IN ('GradeA_Subsidized', 'Voucher', 'Private')),
  role_type TEXT NOT NULL CHECK (role_type IN ('PT', 'PTA', 'OT', 'OTA')),
  slot_variant TEXT NOT NULL
    CHECK (slot_variant IN ('IND_15', 'IND_30', 'GRP_30', 'GRP_60')),
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (policy_version_id, funding_tier, role_type, slot_variant)
);

CREATE TABLE IF NOT EXISTS public.facility_policy_subsidized_pass_order (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version_id UUID NOT NULL
    REFERENCES public.facility_scheduling_policy_versions (id) ON DELETE CASCADE,
  sort_order SMALLINT NOT NULL CHECK (sort_order >= 1 AND sort_order <= 10),
  funding_tier TEXT NOT NULL CHECK (funding_tier IN ('GradeA_Subsidized', 'Voucher', 'Private')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (policy_version_id, sort_order),
  UNIQUE (policy_version_id, funding_tier)
);

CREATE TABLE IF NOT EXISTS public.facility_policy_dementia_core (
  policy_version_id UUID PRIMARY KEY
    REFERENCES public.facility_scheduling_policy_versions (id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  weekly_min_sessions INTEGER NOT NULL DEFAULT 0 CHECK (weekly_min_sessions >= 0),
  special_care_therapist_only BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_facility_policy_dementia_core_updated_at
  ON public.facility_policy_dementia_core;
CREATE TRIGGER trg_facility_policy_dementia_core_updated_at
  BEFORE UPDATE ON public.facility_policy_dementia_core
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_now();

CREATE TABLE IF NOT EXISTS public.facility_policy_dementia_role_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version_id UUID NOT NULL
    REFERENCES public.facility_scheduling_policy_versions (id) ON DELETE CASCADE,
  role_type TEXT NOT NULL CHECK (role_type IN ('OT', 'OTA')),
  slot_variant TEXT NOT NULL
    CHECK (slot_variant IN ('IND_15', 'IND_30', 'GRP_30', 'GRP_60')),
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (policy_version_id, role_type, slot_variant)
);

-- STARCARE Phase 5：排班 KPI 趨勢伺服端持久化（跨裝置共享）

CREATE TABLE IF NOT EXISTS public.scheduling_kpi_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id TEXT NOT NULL,
  ran_at TIMESTAMPTZ NOT NULL,
  coverage_rate NUMERIC(6, 2) NOT NULL CHECK (coverage_rate >= 0),
  conflict_rate_per_100 NUMERIC(6, 2) NOT NULL CHECK (conflict_rate_per_100 >= 0),
  average_assignments_per_resident NUMERIC(8, 4) NOT NULL CHECK (average_assignments_per_resident >= 0),
  under_target_rate NUMERIC(6, 2) NOT NULL CHECK (under_target_rate >= 0),
  resident_count INTEGER NOT NULL CHECK (resident_count >= 0),
  assignment_count INTEGER NOT NULL CHECK (assignment_count >= 0),
  conflict_count INTEGER NOT NULL CHECK (conflict_count >= 0),
  actor_id UUID NOT NULL REFERENCES auth.users (id),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheduling_kpi_history_facility_ran_at
  ON public.scheduling_kpi_history (facility_id, ran_at DESC)
  WHERE is_deleted = false;

ALTER TABLE public.scheduling_kpi_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS scheduling_kpi_history_select_staff ON public.scheduling_kpi_history;
CREATE POLICY scheduling_kpi_history_select_staff
  ON public.scheduling_kpi_history
  FOR SELECT
  TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'admin')
    )
  );

DROP POLICY IF EXISTS scheduling_kpi_history_insert_self ON public.scheduling_kpi_history;
CREATE POLICY scheduling_kpi_history_insert_self
  ON public.scheduling_kpi_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    actor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'admin')
    )
  );

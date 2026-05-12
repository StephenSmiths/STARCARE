-- Seq 29：`scheduling-policy-version-commit` 防重入（X-Idempotency-Key）；僅 service_role 寫入
CREATE TABLE IF NOT EXISTS public.scheduling_policy_commit_idempotency (
  idempotency_key TEXT NOT NULL,
  facility_id TEXT NOT NULL REFERENCES public.facilities (id) ON DELETE CASCADE,
  policy_version_id UUID NOT NULL REFERENCES public.facility_scheduling_policy_versions (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (idempotency_key, facility_id)
);

COMMENT ON TABLE public.scheduling_policy_commit_idempotency IS
  '院舍政策版本 commit 之 idempotency；Edge service_role 寫入；authenticated 無 policy。';

ALTER TABLE public.scheduling_policy_commit_idempotency ENABLE ROW LEVEL SECURITY;

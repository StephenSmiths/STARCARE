-- Seq 9／01 §4.3：可選之正式「下次評估到期日」；未填時仍由入住週期估算（前後端邏輯須同步）

ALTER TABLE public.residents
  ADD COLUMN IF NOT EXISTS assessment_next_due_date DATE NULL;

COMMENT ON COLUMN public.residents.assessment_next_due_date IS
  '評估表下次到期日（可選）；NULL 時由 application／Edge 依 admission_date 週期估算';

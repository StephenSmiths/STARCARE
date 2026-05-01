-- STARCARE Phase 3 Day 3：活動時段匯入測試所需活動主檔 seed（冪等）
-- 對齊 SOP 章節：5 資料完整性（主檔先行、交易後置）

INSERT INTO public.activities (
  id,
  facility_id,
  name,
  service_type,
  activity_kind,
  delivery_mode,
  min_duration_minutes,
  is_deleted
)
VALUES
  ('activity-rehab-01', 'facility-main', '下肢肌力訓練', 'Subsidized_Rehab', 'Training', 'Group', 30, false),
  ('activity-rehab-02', 'facility-main', '平衡協調訓練', 'Subsidized_Rehab', 'Training', 'Group', 30, false),
  ('activity-rehab-03', 'facility-main', '功能性動作訓練', 'Subsidized_Rehab', 'Training', 'Group', 60, false)
ON CONFLICT (id) DO NOTHING;

-- PDF 02【3】附錄：週更表活動 id 依 workPlanCascadeCatalog 擇一；校正既有 seed 名稱並補職類／認知活動主檔（單檔 ≤200 行）

UPDATE public.activities
SET name = '平衡訓練'
WHERE id = 'activity-rehab-02' AND facility_id = 'facility-main';

UPDATE public.activities
SET name = '主動伸展'
WHERE id = 'activity-rehab-03' AND facility_id = 'facility-main';

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
  ('activity-rehab-ot-1', 'facility-main', '懷舊治療小組', 'Subsidized_Rehab', 'Training', 'Group', 60, false),
  ('activity-rehab-ota-1', 'facility-main', '日常生活技能小組', 'Subsidized_Rehab', 'Training', 'Group', 30, false),
  ('activity-rehab-pt-ind-1', 'facility-main', '肌力訓練', 'Subsidized_Rehab', 'Training', 'Individual', 15, false),
  ('activity-rehab-ot-ind-1', 'facility-main', '日常生活活動訓練', 'Subsidized_Rehab', 'Training', 'Individual', 30, false),
  ('activity-dementia-02', 'facility-main', '認知訓練小組', 'Dementia_Care', 'Training', 'Group', 60, false)
ON CONFLICT (id) DO NOTHING;

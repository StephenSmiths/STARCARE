-- Seq 14／02【2】：認知軌預設活動主檔（與資助復康分離；對齊 01 §3 服務類型隔離）
-- min_duration_minutes 須符合 activities 表 CHECK：(15, 30, 60)
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
  ('activity-dementia-01', 'facility-main', '認知刺激小組', 'Dementia_Care', 'Training', 'Group', 60, false)
ON CONFLICT (id) DO NOTHING;

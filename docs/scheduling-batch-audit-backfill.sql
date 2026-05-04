-- 一次性回溯：為既有 scheduling_history 批次補 SCHEDULE_BATCH_SAVE 審計列（Seq 12／go-live §8）。
-- 先於 SQL Editor 檢視：SELECT DISTINCT batch_id FROM public.scheduling_history WHERE is_deleted = false;
-- 可重複執行：僅插入「尚無同 entity_id + SCHEDULE_BATCH_SAVE」之批次。
INSERT INTO public.audit_events (
  action,
  entity_type,
  entity_id,
  actor_id,
  before_state,
  after_state,
  detail,
  occurred_at
)
SELECT
  'SCHEDULE_BATCH_SAVE',
  'Scheduling',
  agg.batch_id,
  agg.actor_id,
  NULL,
  LEFT(json_build_object('count', agg.cnt, 'batchId', agg.batch_id)::text, 32000),
  LEFT(
    '一鍵儲存：批量寫入 scheduling_history（回溯補登；batch=' || agg.batch_id || '）',
    32000
  ),
  agg.first_created_at
FROM (
  SELECT
    batch_id,
    MIN(actor_id) AS actor_id,
    COUNT(*)::int AS cnt,
    MIN(created_at) AS first_created_at
  FROM public.scheduling_history
  WHERE is_deleted = false
  GROUP BY batch_id
) agg
WHERE NOT EXISTS (
  SELECT 1
  FROM public.audit_events ae
  WHERE ae.is_deleted = false
    AND ae.action = 'SCHEDULE_BATCH_SAVE'
    AND ae.entity_id = agg.batch_id
);

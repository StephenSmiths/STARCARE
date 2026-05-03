-- 01 §5／Seq 12：scheduling_history 細粒度 SELECT RLS（與 service_forms 語意對齊）
-- staff 僅讀本人 actor_id 之未刪列；teamlead／admin 讀全院未刪。寫入仍僅 Edge／service_role。

DROP POLICY IF EXISTS scheduling_history_select_staff ON public.scheduling_history;

CREATE POLICY scheduling_history_select_authenticated
  ON public.scheduling_history
  FOR SELECT
  TO authenticated
  USING (
    is_deleted = false
    AND (
      EXISTS (
        SELECT 1
        FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.role IN ('teamlead', 'admin')
      )
      OR (
        actor_id = (SELECT auth.uid()::text)
        AND EXISTS (
          SELECT 1
          FROM public.user_roles ur
          WHERE ur.user_id = auth.uid()
            AND ur.role = 'staff'
        )
      )
    )
  );

COMMENT ON POLICY scheduling_history_select_authenticated ON public.scheduling_history IS
  'SELECT：teamlead/admin 全院未刪列；staff 僅 actor_id = auth.uid()；INSERT 僅 Edge';

-- 01 §1／§2.2：service_forms 細粒度 RLS（Seq 3／17）
-- 直連 PostgREST（authenticated JWT）時：staff 僅讀本人 owner_actor_id；teamlead／admin 讀全院未軟刪。
-- Edge Functions 使用 service_role，不受 RLS 限制（寫入仍僅經 Edge）。
-- 爭議時以 docs/pdf/01-STARCare-核心業務邏輯與-SOP.pdf 為準

DROP POLICY IF EXISTS service_forms_select_authenticated ON public.service_forms;

CREATE POLICY service_forms_select_authenticated
  ON public.service_forms
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
        owner_actor_id = (SELECT auth.uid()::text)
        AND EXISTS (
          SELECT 1
          FROM public.user_roles ur
          WHERE ur.user_id = auth.uid()
            AND ur.role = 'staff'
        )
      )
    )
  );

COMMENT ON POLICY service_forms_select_authenticated ON public.service_forms IS
  'SELECT：teamlead/admin 全院未刪列；staff 僅 owner_actor_id = auth.uid()；寫入走 Edge';

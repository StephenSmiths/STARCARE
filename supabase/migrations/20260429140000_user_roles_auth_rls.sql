-- STARCARE：與 Auth 綁定之角色表（staff / admin），供 RLS 與 Edge 授權。
-- 新使用者由觸發器自動建立 user_roles；既有使用者請手動 INSERT。

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('staff', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.user_roles IS '與 auth.users 1:1；app_metadata.starcare_role 可於註冊時覆寫預設 staff';

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_roles_own_read ON public.user_roles;
CREATE POLICY user_roles_own_read
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 新 Auth 使用者自動掛載角色（預設 staff；Dashboard 可設 raw_app_meta_data.starcare_role = admin）
CREATE OR REPLACE FUNCTION public.handle_new_auth_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r TEXT;
BEGIN
  r := COALESCE(NULLIF(TRIM(NEW.raw_app_meta_data->>'starcare_role'), ''), 'staff');
  IF r NOT IN ('staff', 'admin') THEN
    r := 'staff';
  END IF;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, r)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_starcare_role ON auth.users;
CREATE TRIGGER on_auth_user_created_starcare_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_auth_user_role();

-- 院友：僅具 staff/admin 身分之已登入者可讀未刪除列
DROP POLICY IF EXISTS residents_select_active ON public.residents;
DROP POLICY IF EXISTS residents_select_staff ON public.residents;
CREATE POLICY residents_select_staff
  ON public.residents
  FOR SELECT
  TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'admin')
    )
  );

COMMENT ON POLICY residents_select_staff ON public.residents IS '直連 PostgREST 時須具 user_roles；寫入仍走 Edge service_role';

-- 排班歷史：供日後報表直連查詢
DROP POLICY IF EXISTS scheduling_history_select_staff ON public.scheduling_history;
CREATE POLICY scheduling_history_select_staff
  ON public.scheduling_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'admin')
    )
  );

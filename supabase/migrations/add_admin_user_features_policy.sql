-- =====================================================
-- RLS Policy برای دسترسی Admin به user_features
-- =====================================================

-- ✅ اجازه SELECT برای ادمین‌ها
CREATE POLICY "Admins can view all user features"
ON public.user_features
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- ✅ اجازه INSERT برای ادمین‌ها
CREATE POLICY "Admins can insert user features"
ON public.user_features
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- ✅ اجازه UPDATE برای ادمین‌ها
CREATE POLICY "Admins can update user features"
ON public.user_features
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- ✅ اجازه DELETE برای ادمین‌ها
CREATE POLICY "Admins can delete user features"
ON public.user_features
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- ✅ کاربران عادی فقط می‌توانند features خودشان را ببینند
CREATE POLICY "Users can view their own features"
ON public.user_features
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

COMMENT ON TABLE public.user_features IS 'Feature flags assigned to users. Admins have full access, users can only view their own.';

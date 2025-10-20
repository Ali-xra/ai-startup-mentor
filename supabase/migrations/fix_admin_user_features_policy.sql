-- =====================================================
-- رفع مشکل RLS Policy برای دسترسی Admin به user_features
-- =====================================================

-- ❌ حذف policy قدیمی که with_check نداشت
DROP POLICY IF EXISTS "Admins can manage all user features" ON public.user_features;

-- ✅ ساخت policy جدید با with_check درست
CREATE POLICY "Admins can manage all user features"
ON public.user_features
FOR ALL
TO public
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

-- ✅ اطمینان از اینکه RLS فعال است
ALTER TABLE public.user_features ENABLE ROW LEVEL SECURITY;

COMMENT ON POLICY "Admins can manage all user features" ON public.user_features IS
'Allows active admins to perform all operations (SELECT, INSERT, UPDATE, DELETE) on user_features table';

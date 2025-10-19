-- Function برای حذف کامل کاربر از تمام جداول مرتبط
-- این function فقط توسط admin قابل اجرا است

CREATE OR REPLACE FUNCTION public.delete_user_completely(target_user_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  deleted_count integer := 0;
BEGIN
  -- بررسی که فراخواننده admin است
  IF NOT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Only active admins can delete users';
  END IF;

  -- جلوگیری از حذف خود admin
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot delete yourself';
  END IF;

  -- حذف از investor_profiles
  DELETE FROM public.investor_profiles WHERE id = target_user_id;

  -- حذف از user_features
  DELETE FROM public.user_features WHERE user_id = target_user_id;

  -- حذف از profiles
  DELETE FROM public.profiles WHERE id = target_user_id;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- اگر حذف موفق بود، نتیجه را برگردان
  IF deleted_count > 0 THEN
    result := json_build_object(
      'success', true,
      'message', 'User deleted successfully',
      'user_id', target_user_id
    );
  ELSE
    result := json_build_object(
      'success', false,
      'message', 'User not found or already deleted',
      'user_id', target_user_id
    );
  END IF;

  RETURN result;
END;
$$;

-- اضافه کردن comment برای مستندات
COMMENT ON FUNCTION public.delete_user_completely IS
'Deletes a user completely from all related tables. Only accessible by active admins. Prevents self-deletion.';

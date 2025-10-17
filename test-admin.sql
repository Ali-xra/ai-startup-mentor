-- تست کامل
SELECT 
    u.id as user_id,
    u.email,
    a.role,
    a.is_active,
    CASE 
        WHEN a.id IS NULL THEN 'NOT IN admins table'
        WHEN a.is_active = false THEN 'Inactive'
        ELSE 'OK'
    END as status
FROM auth.users u
LEFT JOIN admins a ON a.user_id = u.id
WHERE u.email = 'ali69.iceland@gmail.com';

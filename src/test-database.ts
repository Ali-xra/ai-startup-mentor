/**
 * تست اتصال به دیتابیس و بررسی جداول
 */

import { supabase } from './services/supabaseClient';

async function testDatabaseSetup() {
    console.log('🔍 در حال تست اتصال به دیتابیس...\n');

    try {
        // 1. تست اتصال به Supabase
        console.log('1️⃣ تست اتصال به Supabase...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError && authError.message !== 'Auth session missing!') {
            console.log('⚠️  کاربر لاگین نیست (عادی است)');
        } else if (user) {
            console.log('✅ کاربر لاگین است:', user.email);
        } else {
            console.log('⚠️  کاربر لاگین نیست (عادی است)');
        }

        // 2. تست جدول upgrade_requests
        console.log('\n2️⃣ تست جدول upgrade_requests...');
        const { data: upgradeRequests, error: upgradeError } = await supabase
            .from('upgrade_requests')
            .select('*')
            .limit(1);

        if (upgradeError) {
            console.log('❌ خطا در جدول upgrade_requests:', upgradeError.message);
        } else {
            console.log('✅ جدول upgrade_requests کار می‌کند');
            console.log('   تعداد رکوردها:', upgradeRequests?.length || 0);
        }

        // 3. تست جدول public_projects
        console.log('\n3️⃣ تست جدول public_projects...');
        const { data: publicProjects, error: projectsError } = await supabase
            .from('public_projects')
            .select('*')
            .limit(1);

        if (projectsError) {
            console.log('❌ خطا در جدول public_projects:', projectsError.message);
        } else {
            console.log('✅ جدول public_projects کار می‌کند');
            console.log('   تعداد رکوردها:', publicProjects?.length || 0);
        }

        // 4. تست جدول project_likes
        console.log('\n4️⃣ تست جدول project_likes...');
        const { data: projectLikes, error: likesError } = await supabase
            .from('project_likes')
            .select('*')
            .limit(1);

        if (likesError) {
            console.log('❌ خطا در جدول project_likes:', likesError.message);
        } else {
            console.log('✅ جدول project_likes کار می‌کند');
            console.log('   تعداد رکوردها:', projectLikes?.length || 0);
        }

        // 5. تست جدول project_comments
        console.log('\n5️⃣ تست جدول project_comments...');
        const { data: projectComments, error: commentsError } = await supabase
            .from('project_comments')
            .select('*')
            .limit(1);

        if (commentsError) {
            console.log('❌ خطا در جدول project_comments:', commentsError.message);
        } else {
            console.log('✅ جدول project_comments کار می‌کند');
            console.log('   تعداد رکوردها:', projectComments?.length || 0);
        }

        // 6. تست function get_public_projects
        console.log('\n6️⃣ تست function get_public_projects...');
        const { data: rpcProjects, error: rpcError } = await supabase
            .rpc('get_public_projects', {
                p_filter: 'all',
                p_limit: 5,
                p_offset: 0
            });

        if (rpcError) {
            console.log('❌ خطا در function get_public_projects:', rpcError.message);
        } else {
            console.log('✅ Function get_public_projects کار می‌کند');
            console.log('   تعداد پروژه‌های برگشتی:', rpcProjects?.length || 0);
        }

        // 7. تست function has_user_liked_project
        console.log('\n7️⃣ تست function has_user_liked_project...');
        const testProjectId = '00000000-0000-0000-0000-000000000000'; // یک UUID تستی
        const testUserId = '00000000-0000-0000-0000-000000000000'; // یک UUID تستی
        const { data: hasLiked, error: hasLikedError } = await supabase
            .rpc('has_user_liked_project', {
                p_project_id: testProjectId,
                p_user_id: testUserId
            });

        if (hasLikedError) {
            console.log('❌ خطا در function has_user_liked_project:', hasLikedError.message);
        } else {
            console.log('✅ Function has_user_liked_project کار می‌کند');
            console.log('   نتیجه:', hasLiked);
        }

        console.log('\n' + '='.repeat(50));
        console.log('✅ همه تست‌ها انجام شد!');
        console.log('='.repeat(50));

    } catch (error) {
        console.error('\n❌ خطای غیرمنتظره:', error);
    }
}

// اجرای تست
testDatabaseSetup();

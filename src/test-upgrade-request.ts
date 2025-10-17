/**
 * تست سیستم upgrade_requests
 */

import { supabase } from './services/supabaseClient';

async function testUpgradeRequests() {
    console.log('🧪 شروع تست upgrade_requests...\n');

    // 1. تست اتصال
    console.log('1️⃣ تست اتصال به Supabase...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.log('❌ کاربر لاگین نیست. لطفاً ابتدا وارد شوید.');
        return;
    }

    console.log('✅ کاربر:', user.email);
    console.log('   User ID:', user.id);

    // 2. تست خواندن جدول upgrade_requests
    console.log('\n2️⃣ تست خواندن جدول upgrade_requests...');
    const { data: allRequests, error: selectError } = await supabase
        .from('upgrade_requests')
        .select('*');

    if (selectError) {
        console.log('❌ خطا در خواندن جدول:', selectError);
        console.log('   Code:', selectError.code);
        console.log('   Message:', selectError.message);
        console.log('   Details:', selectError.details);
        console.log('   Hint:', selectError.hint);
    } else {
        console.log('✅ تعداد درخواست‌ها:', allRequests?.length || 0);
        if (allRequests && allRequests.length > 0) {
            console.log('   نمونه:', allRequests[0]);
        }
    }

    // 3. تست چک کردن pending request
    console.log('\n3️⃣ تست چک کردن pending request...');
    const { data: pendingRequest, error: pendingError } = await supabase
        .from('upgrade_requests')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle(); // استفاده از maybeSingle به جای single

    if (pendingError) {
        console.log('❌ خطا:', pendingError);
    } else if (pendingRequest) {
        console.log('✅ شما یک pending request دارید:', pendingRequest);
    } else {
        console.log('✅ هیچ pending request وجود ندارد');
    }

    // 4. تست ساخت درخواست جدید
    console.log('\n4️⃣ تست ساخت درخواست جدید...');

    if (pendingRequest) {
        console.log('⚠️  از ساخت درخواست جدید صرف نظر شد (pending request موجود است)');
    } else {
        const { data: newRequest, error: insertError } = await supabase
            .from('upgrade_requests')
            .insert({
                user_id: user.id,
                requested_plan: 'pro',
                status: 'pending'
            })
            .select()
            .single();

        if (insertError) {
            console.log('❌ خطا در ساخت درخواست:', insertError);
            console.log('   Code:', insertError.code);
            console.log('   Message:', insertError.message);
            console.log('   Details:', insertError.details);
        } else {
            console.log('✅ درخواست با موفقیت ساخته شد:', newRequest);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ تست به پایان رسید');
    console.log('='.repeat(60));
}

// اجرای تست
testUpgradeRequests().catch(err => {
    console.error('❌ خطای غیرمنتظره:', err);
});

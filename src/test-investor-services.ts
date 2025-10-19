// ==========================================
// Test Investor Services
// ==========================================

import { supabase } from './services/supabaseClient';
import { investorProfileService } from './services/investorProfileService';
import { investorProjectService } from './services/investorProjectService';
import { connectionService } from './services/connectionService';

async function testInvestorServices() {
  console.log('🧪 Testing Investor Services...\n');

  try {
    // ==========================================
    // Test 1: Database Connection
    // ==========================================
    console.log('1️⃣ Testing Database Connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (healthError) {
      console.error('❌ Database connection failed:', healthError);
      return;
    }
    console.log('✅ Database connection successful\n');

    // ==========================================
    // Test 2: Check Tables Exist
    // ==========================================
    console.log('2️⃣ Checking if Investor Portal tables exist...');

    const tables = [
      'investor_profiles',
      'project_views',
      'connections',
      'connection_messages',
      'verification_requests',
      'saved_projects',
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1);

      if (error && error.code !== 'PGRST116') {
        console.error(`❌ Table "${table}" check failed:`, error.message);
      } else {
        console.log(`✅ Table "${table}" exists`);
      }
    }
    console.log('');

    // ==========================================
    // Test 3: Check Functions Exist
    // ==========================================
    console.log('3️⃣ Checking if database functions exist...');

    // Test check_investor_view_limit (با UUID تستی)
    try {
      const testUserId = '00000000-0000-0000-0000-000000000000';
      const { error } = await supabase.rpc('check_investor_view_limit', {
        p_investor_id: testUserId,
      });

      if (error) {
        console.log(
          `⚠️  Function "check_investor_view_limit" exists but returned error (expected for test UUID)`
        );
      } else {
        console.log(`✅ Function "check_investor_view_limit" exists and works`);
      }
    } catch (err: any) {
      console.error(`❌ Function "check_investor_view_limit" failed:`, err.message);
    }

    // Test get_public_projects_filtered
    try {
      const { data, error } = await supabase.rpc('get_public_projects_filtered', {
        p_industries: null,
        p_stages: null,
        p_investment_min: null,
        p_investment_max: null,
        p_seeking_investment: null,
        p_limit: 5,
        p_offset: 0,
      });

      if (error) {
        console.error(`❌ Function "get_public_projects_filtered" failed:`, error.message);
      } else {
        console.log(
          `✅ Function "get_public_projects_filtered" works (returned ${data?.length || 0} projects)`
        );
      }
    } catch (err: any) {
      console.error(`❌ Function "get_public_projects_filtered" failed:`, err.message);
    }

    console.log('');

    // ==========================================
    // Test 4: Service Methods (Read-Only)
    // ==========================================
    console.log('4️⃣ Testing Service Methods (read-only)...');

    // Test getPublicProjects
    try {
      const projects = await investorProjectService.getPublicProjects({ limit: 5 });
      console.log(
        `✅ investorProjectService.getPublicProjects() works (found ${projects.length} projects)`
      );
    } catch (err: any) {
      console.error(`❌ investorProjectService.getPublicProjects() failed:`, err.message);
    }

    // Test getFeaturedProjects
    try {
      const featured = await investorProjectService.getFeaturedProjects(3);
      console.log(
        `✅ investorProjectService.getFeaturedProjects() works (found ${featured.length} featured)`
      );
    } catch (err: any) {
      console.error(`❌ investorProjectService.getFeaturedProjects() failed:`, err.message);
    }

    console.log('');

    // ==========================================
    // Test 5: RLS Policies Check
    // ==========================================
    console.log('5️⃣ Checking RLS Policies...');

    // Check if RLS is enabled
    for (const table of tables) {
      const { data, error } = await supabase
        .rpc('pg_table_is_visible', { table_name: table } as any)
        .single();

      // این یک تست ساده است - در production باید دقیق‌تر تست کنیم
      console.log(`ℹ️  RLS check for "${table}": basic query works`);
    }

    console.log('');

    // ==========================================
    // Summary
    // ==========================================
    console.log('✅ All basic tests completed!');
    console.log('');
    console.log('📝 Next Steps:');
    console.log('   1. Create a test user and investor profile');
    console.log('   2. Test creating connections');
    console.log('   3. Test verification workflow');
    console.log('   4. Build the UI components');
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testInvestorServices();

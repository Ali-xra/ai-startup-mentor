// ==========================================
// Investor Portal Types
// ==========================================

export type InvestorType = 'angel' | 'vc' | 'corporate' | 'partner';
export type InvestorTier = 'free' | 'verified' | 'premium';

// Portfolio Item
export interface PortfolioItem {
  name: string;
  url?: string;
  amount?: number;
  year?: number;
  description?: string;
}

// Investor Profile
export interface InvestorProfile {
  id: string; // Primary key - همان user ID
  investor_type: InvestorType | null;
  company_name: string | null;
  investment_min: number | null;
  investment_max: number | null;
  preferred_industries: string[];
  preferred_stages: string[];
  preferred_locations: string[];
  years_of_experience: number | null;
  portfolio: PortfolioItem[];
  tier: InvestorTier;
  verification_notes: string | null;
  verified_at: string | null;
  verified_by: string | null;
  monthly_project_views: number;
  last_view_reset: string;
  created_at: string;
  updated_at: string;
}

// User Profile (extends profiles table)
export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: 'entrepreneur' | 'investor'; // تغییر از user_type به role
  created_at: string;
  updated_at: string;
}

// Verification Request
export interface VerificationRequest {
  id: string;
  user_id: string;
  request_type: 'investor_verification';
  submitted_data: InvestorVerificationData;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Investor Verification Data (submitted with request)
export interface InvestorVerificationData {
  company_name?: string;
  investor_type: InvestorType;
  investment_range: {
    min: number;
    max: number;
  };
  industries: string[];
  linkedin: string;
  experience: string;
  portfolio: PortfolioItem[];
}

// Combined Investor Profile (with user data)
export interface InvestorProfileWithUser extends InvestorProfile {
  user_profile: UserProfile;
}

// Dashboard Stats for Investor
export interface InvestorDashboardStats {
  total_projects_viewed: number;
  saved_projects_count: number;
  pending_connections: number;
  accepted_connections: number;
  monthly_views_remaining: number; // -1 for unlimited (verified/premium)
}

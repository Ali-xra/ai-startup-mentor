// ==========================================
// Project Types (Extended for Investor Portal)
// ==========================================

export type ProjectVisibility = 'private' | 'public' | 'unlisted';

// Extended Project interface with investor portal fields
export interface Project {
  id: string; // BIGINT in DB
  user_id: string;
  project_name: string;
  initial_idea: string;
  stage: string;

  // Investor Portal fields
  visibility: ProjectVisibility;
  seeking_investment: boolean;
  investment_amount: number | null;
  equity_offered: number | null;
  pitch_deck_url: string | null;

  // Analytics
  view_count: number;
  interest_count: number;
  featured: boolean;
  featured_until: string | null;

  created_at: string;
  updated_at: string;
}

// Public Project (visible to investors)
export interface PublicProject extends Project {
  owner_name: string;
  owner_email: string;
  owner_avatar?: string | null;
}

// Project with detailed owner info
export interface ProjectWithOwner extends Project {
  owner: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
    linkedin_url: string | null;
  };
}

// Project Filters (for search/discovery)
export interface ProjectFilters {
  industries?: string[];
  stages?: string[];
  investmentMin?: number;
  investmentMax?: number;
  seekingInvestment?: boolean;
  limit?: number;
  offset?: number;
  searchQuery?: string;
}

// Project Search Result
export interface ProjectSearchResult {
  projects: PublicProject[];
  total_count: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

// Project Analytics (for project owners)
export interface ProjectAnalytics {
  project_id: string;
  total_views: number;
  unique_viewers: number;
  total_interests: number;
  total_saves: number;
  connections_pending: number;
  connections_accepted: number;
  connections_rejected: number;
  recent_viewers: Array<{
    viewer_id: string;
    viewer_name: string;
    viewed_at: string;
  }>;
}

// ==========================================
// Connection & Messaging Types
// ==========================================

import type { InvestorProfile, UserProfile } from './investor';

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'contacted' | 'closed';

// Connection between investor and project
export interface Connection {
  id: string;
  project_id: string; // Note: BIGINT in DB
  investor_id: string;
  status: ConnectionStatus;
  message: string;
  response: string | null;
  requested_at: string;
  responded_at: string | null;
  last_activity: string;
  metadata: Record<string, any>;
}

// Connection with full project details
export interface ConnectionWithProject extends Connection {
  project: {
    id: string;
    project_name: string;
    initial_idea: string;
    stage: string;
    seeking_investment: boolean;
    investment_amount: number | null;
    equity_offered: number | null;
    view_count: number;
    interest_count: number;
    created_at: string;
    user_id: string;
    owner_name: string;
    owner_email: string;
  };
}

// Connection with investor details (for project owners)
export interface ConnectionWithInvestor extends Connection {
  investor: InvestorProfile & {
    user_profile: UserProfile;
  };
}

// Connection Message
export interface ConnectionMessage {
  id: string;
  connection_id: string;
  sender_id: string;
  message: string;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

// Connection Message with sender details
export interface ConnectionMessageWithSender extends ConnectionMessage {
  sender: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
  };
}

// Saved Project
export interface SavedProject {
  id: string;
  user_id: string;
  project_id: string;
  saved_at: string;
  notes: string | null;
}

// Saved Project with full details
export interface SavedProjectWithDetails extends SavedProject {
  project: {
    id: string;
    project_name: string;
    initial_idea: string;
    stage: string;
    seeking_investment: boolean;
    investment_amount: number | null;
    equity_offered: number | null;
    view_count: number;
    interest_count: number;
    created_at: string;
    user_id: string;
    owner_name: string;
    owner_email: string;
  };
}

// Project View (analytics)
export interface ProjectView {
  id: string;
  project_id: string;
  viewer_id: string;
  viewed_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

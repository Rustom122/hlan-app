
// Dates are stored as ISO strings
export type Timestamp = string;

export interface User {
  uid: string;
  email: string;
  role: 'creator' | 'brand' | 'admin';
  name: string;
  photoURL?: string;
  createdAt: Timestamp;
  // Role-specific data
  creatorProfile?: {
    city: string;
    ageGroup: string;
    instagramHandle?: string;
    reliabilityScore: number;
    isVerified: boolean;
  };
  brandProfile?: {
    companyName: string;
    billingAddress: string;
    industry: string;
  };
}

export interface Campaign {
  id: string;
  brandId: string;
  title: string;
  description: string;
  instructions: string;

  // Financials
  totalBudget: number;
  payoutPerCreator: number;
  platformFeePercent: number;

  // Targeting
  targetCity: string;
  targetAgeGroup?: string[];

  // Status
  status: 'draft' | 'pending_approval' | 'active' | 'paused' | 'completed' | 'archived';

  // Capacity
  maxCreators: number;
  currentSubmissions: number;
  approvedSubmissions: number;

  createdAt: Timestamp;
  deadline: Timestamp;
}

export interface Submission {
  id: string;
  campaignId: string;
  creatorId: string;

  // The Proof
  proofUrl: string;
  socialLink?: string;

  status: 'reserved' | 'submitted' | 'approved' | 'rejected';

  // Timestamps
  reservedAt: Timestamp;
  submittedAt?: Timestamp;
  reviewedAt?: Timestamp;

  feedback?: string;
}

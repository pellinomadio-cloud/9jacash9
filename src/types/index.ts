export interface User {
  id: string;
  name: string;
  email: string;
  pin: string; // 4-digit password
  membershipId: string;
  balance: number;
  availableBalance: number;
  tier?: number; // Tier 1, 2, or 3 (defaults to 1)
  pendingEarnings?: number; // Earnings stored in pending state when tier balance limit is reached
  quickCodes?: (string | { code: string; planName: string; withdrawalsLeft: number })[];
  referralCode?: string; // User's unique referral code
  referredBy?: string; // Referral code or user id that referred this user
  referralEarnings?: number; // Total cash earned from referring friends
  referralCount?: number; // Count of successful invited referrals
  createdAt: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referrerName: string;
  referredUserId: string;
  referredUserName: string;
  referredUserEmail: string;
  bonusAmount: number;
  date: string;
  time: string;
}

export interface CompanyAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode?: string;
  updatedAt?: string;
}

export interface QuickCodeItem {
  code: string;
  planName: string;
  withdrawalsLeft: number;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  receiptName: string;
  planName?: string;
  withdrawalsCount?: number;
  status: 'pending' | 'approved' | 'declined';
  declineReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reference: string;
}

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  date: string;
  type?: 'info' | 'success' | 'alert' | 'admin';
  targetUserId?: string; // 'all' or specific user id
}

export interface Transaction {
  id: string;
  type: 'earn' | 'deposit' | 'withdraw' | 'quickcode' | 'transfer' | 'upgrade';
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  time: string;
  isCredit: boolean;
  status: 'successful' | 'pending' | 'failed';
  reference: string;
}

export type ActiveTab = 'home' | 'cards' | 'payments' | 'support' | 'more';

export type CurrentScreen =
  | 'dashboard'
  | 'earn'
  | 'deposit'
  | 'withdraw'
  | 'quickcode'
  | 'account_details'
  | 'transaction_history'
  | 'referrals'
  | 'notifications'
  | 'settings'
  | 'terms'
  | 'admin'
  | 'live_chat'
  | 'upgrade_tier';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Transaction, AppNotification, CompanyAccount, DepositRequest, ReferralRecord } from '../types/index.ts';

export const TIER_LIMITS: Record<number, number> = {
  1: 400000,    // ₦400,000 for Tier 1
  2: 2000000,   // ₦2,000,000 for Tier 2
  3: 5000000,   // ₦5,000,000 for Tier 3
};

export const TIER_UPGRADE_PRICES: Record<number, number> = {
  2: 6600, // ₦6,600 to upgrade to Tier 2
  3: 8000, // ₦8,000 to upgrade to Tier 3
};

export const REFERRAL_BONUS_AMOUNT = 1500; // ₦1,500 instant bonus per referral

interface AuthContextType {
  user: User | null;
  transactions: Transaction[];
  notifications: AppNotification[];
  companyAccount: CompanyAccount;
  depositRequests: DepositRequest[];
  referrals: ReferralRecord[];
  isAuthenticated: boolean;
  isBalanceHidden: boolean;
  toggleBalanceVisibility: () => void;
  register: (name: string, email: string, pin: string, referralCode?: string) => Promise<{ success: boolean; message?: string }>;
  login: (email: string, pin: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'time' | 'reference'>) => void;
  formatNaira: (amount: number) => string;
  clearTransactions: () => void;
  getAllRegisteredUsers: () => User[];
  sendBroadcastNotification: (title: string, desc: string, type?: 'info' | 'success' | 'alert' | 'admin') => boolean;
  deleteNotification: (id: string) => void;
  updateCompanyAccount: (account: CompanyAccount) => void;
  submitDepositRequest: (amount: number, receiptName: string, planName?: string, withdrawalsCount?: number) => DepositRequest | null;
  approveDepositRequest: (requestId: string) => boolean;
  declineDepositRequest: (requestId: string, reason?: string) => boolean;
  consumeQuickCode: (code: string) => boolean;
  withdrawFunds: (params: {
    bank: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    quickCode: string;
  }) => { success: boolean; message?: string };
  upgradeTier: (targetTier: number, paymentReceiptName?: string) => { success: boolean; message?: string };
  getUserTierLimit: (tier?: number) => number;
  getUserReferrals: () => ReferralRecord[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = '9jacash_users_db';
const CURRENT_USER_KEY = '9jacash_current_session';
const TRANSACTIONS_PREFIX = '9jacash_tx_';
const NOTIFICATIONS_STORAGE_KEY = '9jacash_broadcast_notifications';
const COMPANY_ACCOUNT_STORAGE_KEY = '9jacash_company_account_config';
const DEPOSIT_REQUESTS_STORAGE_KEY = '9jacash_deposit_requests_db';
const REFERRALS_STORAGE_KEY = '9jacash_referrals_db';

const DEFAULT_COMPANY_ACCOUNT: CompanyAccount = {
  bankName: 'Moniepoint MFB',
  accountNumber: '9048291048',
  accountName: '9jacash Official Services',
  updatedAt: new Date().toISOString(),
};

function generateMembershipId(): string {
  return '9JA-' + Math.floor(100000 + Math.random() * 900000);
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_welcome',
    title: 'Welcome to 9jacash! 🎉',
    desc: 'Your secure digital account is ready. Enjoy zero fees and instant banking across Nigeria.',
    time: 'Just now',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: 'admin',
    targetUserId: 'all',
  },
  {
    id: 'notif_cashback',
    title: '5% Cashback Program Active',
    desc: 'Top up any MTN, Airtel, Glo or 9mobile line and receive 5% instant cash reward back.',
    time: 'Today',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: 'info',
    targetUserId: 'all',
  },
  {
    id: 'notif_security',
    title: 'Security Notice: Keep Your PIN Safe',
    desc: 'Never share your 4-digit secret PIN or authorization codes with anyone. 9jacash staff will never request them.',
    time: '1 hour ago',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: 'alert',
    targetUserId: 'all',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [companyAccount, setCompanyAccount] = useState<CompanyAccount>(DEFAULT_COMPANY_ACCOUNT);
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(false);

  // Load stored data from localStorage
  const loadStoredConfig = useCallback(() => {
    try {
      // Notifications
      const savedNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      } else {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
        setNotifications(DEFAULT_NOTIFICATIONS);
      }

      // Company Account
      const savedCompanyAcc = localStorage.getItem(COMPANY_ACCOUNT_STORAGE_KEY);
      if (savedCompanyAcc) {
        setCompanyAccount(JSON.parse(savedCompanyAcc));
      } else {
        localStorage.setItem(COMPANY_ACCOUNT_STORAGE_KEY, JSON.stringify(DEFAULT_COMPANY_ACCOUNT));
        setCompanyAccount(DEFAULT_COMPANY_ACCOUNT);
      }

      // Deposit Requests
      const savedDepositReqs = localStorage.getItem(DEPOSIT_REQUESTS_STORAGE_KEY);
      if (savedDepositReqs) {
        setDepositRequests(JSON.parse(savedDepositReqs));
      } else {
        setDepositRequests([]);
      }

      // Referrals
      const savedReferrals = localStorage.getItem(REFERRALS_STORAGE_KEY);
      if (savedReferrals) {
        setReferrals(JSON.parse(savedReferrals));
      } else {
        setReferrals([]);
      }
    } catch (e) {
      console.error('Failed to load stored configuration', e);
      setNotifications(DEFAULT_NOTIFICATIONS);
      setCompanyAccount(DEFAULT_COMPANY_ACCOUNT);
      setDepositRequests([]);
      setReferrals([]);
    }
  }, []);

  // Initialize session from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (savedUser) {
        const parsedUser: User = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // Load user's transactions
        const savedTx = localStorage.getItem(`${TRANSACTIONS_PREFIX}${parsedUser.id}`);
        if (savedTx) {
          setTransactions(JSON.parse(savedTx));
        } else {
          setTransactions([]);
        }
      }
    } catch (e) {
      console.error('Failed to load session', e);
    }
    loadStoredConfig();
  }, [loadStoredConfig]);

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((prev) => !prev);
  };

  const updateCompanyAccount = (newAccount: CompanyAccount) => {
    const updated = {
      ...newAccount,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(COMPANY_ACCOUNT_STORAGE_KEY, JSON.stringify(updated));
    setCompanyAccount(updated);
  };

  const getAllRegisteredUsers = (): User[] => {
    try {
      const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      if (existingUsersRaw) {
        const users: User[] = JSON.parse(existingUsersRaw);
        return users;
      }
      return [];
    } catch (e) {
      console.error('Failed to get all registered users', e);
      return [];
    }
  };

  const sendBroadcastNotification = (
    title: string,
    desc: string,
    type: 'info' | 'success' | 'alert' | 'admin' = 'admin'
  ): boolean => {
    try {
      const newNotif: AppNotification = {
        id: 'notif_' + Date.now() + Math.random().toString(36).substring(2, 6),
        title: title.trim(),
        desc: desc.trim(),
        time: 'Just now',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type,
        targetUserId: 'all',
      };

      const existingNotifsRaw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const currentList: AppNotification[] = existingNotifsRaw ? JSON.parse(existingNotifsRaw) : DEFAULT_NOTIFICATIONS;
      const updatedList = [newNotif, ...currentList];

      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedList));
      setNotifications(updatedList);
      return true;
    } catch (e) {
      console.error('Failed to send broadcast notification', e);
      return false;
    }
  };

  const deleteNotification = (id: string) => {
    try {
      const updatedList = notifications.filter((n) => n.id !== id);
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedList));
      setNotifications(updatedList);
    } catch (e) {
      console.error('Failed to delete notification', e);
    }
  };

  // Submit a deposit request (Enters Pending Approval state)
  const submitDepositRequest = (
    amount: number,
    receiptName: string,
    planName = '1 Withdrawal Plan',
    withdrawalsCount = 1
  ): DepositRequest | null => {
    if (!user) return null;

    const reference = 'DEP9JA' + Math.floor(10000000 + Math.random() * 90000000);
    const newRequest: DepositRequest = {
      id: 'dpr_' + Date.now(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      amount,
      bankName: companyAccount.bankName,
      accountNumber: companyAccount.accountNumber,
      receiptName,
      planName,
      withdrawalsCount,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reference,
    };

    // Add to deposit requests
    const updatedRequests = [newRequest, ...depositRequests];
    setDepositRequests(updatedRequests);
    localStorage.setItem(DEPOSIT_REQUESTS_STORAGE_KEY, JSON.stringify(updatedRequests));

    // Record pending transaction in user history
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      type: 'quickcode',
      title: 'Quick Code Purchase',
      subtitle: `Plan Payment • Pending Admin Review`,
      amount,
      date: dateStr,
      time: timeStr,
      isCredit: false,
      status: 'pending',
      reference,
    };

    const updatedTxList = [newTx, ...transactions];
    setTransactions(updatedTxList);
    localStorage.setItem(`${TRANSACTIONS_PREFIX}${user.id}`, JSON.stringify(updatedTxList));

    return newRequest;
  };

  // Admin approves a deposit request -> generates Quick Code & updates tx
  const approveDepositRequest = (requestId: string): boolean => {
    try {
      const existingReqsRaw = localStorage.getItem(DEPOSIT_REQUESTS_STORAGE_KEY);
      const reqList: DepositRequest[] = existingReqsRaw ? JSON.parse(existingReqsRaw) : depositRequests;
      const targetReq = reqList.find((r) => r.id === requestId);
      if (!targetReq || targetReq.status !== 'pending') return false;

      // Mark approved
      targetReq.status = 'approved';
      targetReq.reviewedAt = new Date().toISOString();
      localStorage.setItem(DEPOSIT_REQUESTS_STORAGE_KEY, JSON.stringify(reqList));
      setDepositRequests([...reqList]);

      const assignedCode = '9JA-' + Math.floor(1000 + Math.random() * 9000);
      const newCodeItem = {
        code: assignedCode,
        planName: targetReq.planName || '1 Withdrawal Plan',
        withdrawalsLeft: targetReq.withdrawalsCount || 1,
      };

      // Add Quick Code to the target user's quickCodes list
      const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      if (existingUsersRaw) {
        const users: User[] = JSON.parse(existingUsersRaw);
        const targetUserIdx = users.findIndex((u) => u.id === targetReq.userId);
        if (targetUserIdx !== -1) {
          const userCodes = users[targetUserIdx].quickCodes || [];
          users[targetUserIdx].quickCodes = [newCodeItem, ...userCodes];
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

          // If current logged-in user is this target user, update state
          if (user && user.id === targetReq.userId) {
            const updatedCurr = { ...user, quickCodes: users[targetUserIdx].quickCodes };
            setUser(updatedCurr);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedCurr));
          }
        }
      }

      // Update target user's transaction status to successful
      const userTxRaw = localStorage.getItem(`${TRANSACTIONS_PREFIX}${targetReq.userId}`);
      if (userTxRaw) {
        const userTxs: Transaction[] = JSON.parse(userTxRaw);
        const targetTx = userTxs.find((tx) => tx.reference === targetReq.reference);
        if (targetTx) {
          targetTx.status = 'successful';
          targetTx.subtitle = `Quick Code Generated: ${assignedCode}`;
          localStorage.setItem(`${TRANSACTIONS_PREFIX}${targetReq.userId}`, JSON.stringify(userTxs));
          if (user && user.id === targetReq.userId) {
            setTransactions([...userTxs]);
          }
        }
      }

      // Send approval notification
      sendBroadcastNotification(
        `Quick Code Approved! 🎉`,
        `Your payment receipt has been approved. Your Quick Code is ${assignedCode}. Check your dashboard to copy and use it for withdrawal.`,
        'success'
      );

      return true;
    } catch (e) {
      console.error('Failed to approve deposit request', e);
      return false;
    }
  };

  // Admin declines a deposit request
  const declineDepositRequest = (requestId: string, reason?: string): boolean => {
    try {
      const existingReqsRaw = localStorage.getItem(DEPOSIT_REQUESTS_STORAGE_KEY);
      const reqList: DepositRequest[] = existingReqsRaw ? JSON.parse(existingReqsRaw) : depositRequests;
      const targetReq = reqList.find((r) => r.id === requestId);
      if (!targetReq || targetReq.status !== 'pending') return false;

      targetReq.status = 'declined';
      targetReq.declineReason = reason || 'Payment receipt could not be verified or transfer was unconfirmed.';
      targetReq.reviewedAt = new Date().toISOString();
      localStorage.setItem(DEPOSIT_REQUESTS_STORAGE_KEY, JSON.stringify(reqList));
      setDepositRequests([...reqList]);

      // Update target user's transaction status to failed
      const userTxRaw = localStorage.getItem(`${TRANSACTIONS_PREFIX}${targetReq.userId}`);
      if (userTxRaw) {
        const userTxs: Transaction[] = JSON.parse(userTxRaw);
        const targetTx = userTxs.find((tx) => tx.reference === targetReq.reference);
        if (targetTx) {
          targetTx.status = 'failed';
          targetTx.subtitle = `Declined: ${targetReq.declineReason}`;
          localStorage.setItem(`${TRANSACTIONS_PREFIX}${targetReq.userId}`, JSON.stringify(userTxs));
          if (user && user.id === targetReq.userId) {
            setTransactions([...userTxs]);
          }
        }
      }

      // Send decline notification
      sendBroadcastNotification(
        `Deposit Verification Declined ⚠️`,
        `Deposit of ${formatNaira(targetReq.amount)} was declined. Reason: ${targetReq.declineReason}. Please ensure you upload a complete, clear screenshot of your bank transfer.`,
        'alert'
      );

      return true;
    } catch (e) {
      console.error('Failed to decline deposit request', e);
      return false;
    }
  };

  // Consume a quick code when used for a successful withdrawal (decrements withdrawalsLeft, expires when 0)
  const consumeQuickCode = (code: string): boolean => {
    try {
      const freshUserRaw = localStorage.getItem(CURRENT_USER_KEY);
      const currentUser: User | null = freshUserRaw ? JSON.parse(freshUserRaw) : user;
      if (!currentUser) return false;
      const cleanCode = code.trim().toUpperCase();
      if (!cleanCode) return false;
      const userCodes = currentUser.quickCodes || [];
      
      // Find index or item matching the code
      const codeIdx = userCodes.findIndex((item) => {
        if (typeof item === 'string') return item.trim().toUpperCase() === cleanCode;
        return item.code.trim().toUpperCase() === cleanCode;
      });

      if (codeIdx === -1) {
        return false;
      }

      const targetItem = userCodes[codeIdx];
      let updatedCodes = [...userCodes];

      if (typeof targetItem === 'string') {
        // Legacy string code expires immediately after 1 usage
        updatedCodes.splice(codeIdx, 1);
      } else {
        // Structured item with withdrawalsLeft
        if (targetItem.withdrawalsLeft > 1) {
          // Decrement remaining withdrawals
          updatedCodes[codeIdx] = {
            ...targetItem,
            withdrawalsLeft: targetItem.withdrawalsLeft - 1,
          };
        } else {
          // Expired completely (0 withdrawals left)
          updatedCodes.splice(codeIdx, 1);
        }
      }

      const updatedUser = {
        ...currentUser,
        quickCodes: updatedCodes,
      };

      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      // Update in users table
      const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      if (existingUsersRaw) {
        const existingUsers: User[] = JSON.parse(existingUsersRaw);
        const idx = existingUsers.findIndex((u) => u.id === currentUser.id);
        if (idx !== -1) {
          existingUsers[idx] = updatedUser;
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
        }
      }

      return true;
    } catch (e) {
      console.error('Failed to consume quick code', e);
      return false;
    }
  };

  // Atomic withdrawal processor that validates quick code, decrements usage or expires it, updates balance, and logs transaction safely
  const withdrawFunds = (params: {
    bank: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    quickCode: string;
  }): { success: boolean; message?: string } => {
    try {
      const freshUserRaw = localStorage.getItem(CURRENT_USER_KEY);
      const currentUser: User | null = freshUserRaw ? JSON.parse(freshUserRaw) : user;
      if (!currentUser) {
        return { success: false, message: 'User session not found.' };
      }

      if (params.amount <= 0 || params.amount > currentUser.balance) {
        return { success: false, message: 'Insufficient wallet balance.' };
      }

      const cleanCode = params.quickCode.trim().toUpperCase();
      const userCodes = currentUser.quickCodes || [];
      
      const codeIdx = userCodes.findIndex((item) => {
        if (typeof item === 'string') return item.trim().toUpperCase() === cleanCode;
        return item.code.trim().toUpperCase() === cleanCode;
      });

      if (codeIdx === -1) {
        return {
          success: false,
          message: 'Invalid or expired Quick Code. Please verify your code or purchase an active Quick Code.',
        };
      }

      const targetItem = userCodes[codeIdx];
      let updatedCodes = [...userCodes];

      if (typeof targetItem === 'string') {
        // Expire immediately
        updatedCodes.splice(codeIdx, 1);
      } else {
        if (targetItem.withdrawalsLeft > 1) {
          // Decrement remaining usages
          updatedCodes[codeIdx] = {
            ...targetItem,
            withdrawalsLeft: targetItem.withdrawalsLeft - 1,
          };
        } else {
          // Depleted all withdrawals -> fully expired and removed
          updatedCodes.splice(codeIdx, 1);
        }
      }

      // Compute updated balance
      const updatedBalance = Math.max(0, currentUser.balance - params.amount);
      const updatedUser: User = {
        ...currentUser,
        balance: updatedBalance,
        availableBalance: updatedBalance,
        quickCodes: updatedCodes,
      };

      // Persist user session & database
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      if (existingUsersRaw) {
        const existingUsers: User[] = JSON.parse(existingUsersRaw);
        const idx = existingUsers.findIndex((u) => u.id === currentUser.id);
        if (idx !== -1) {
          existingUsers[idx] = updatedUser;
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
        }
      }

      // Add withdrawal transaction
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const reference = 'TX9JA' + Math.floor(1000000000 + Math.random() * 9000000000);

      const newTx: Transaction = {
        id: 'tx_' + Date.now(),
        type: 'withdraw',
        title: 'Withdrawal',
        subtitle: `To: ${params.bank} - ${params.accountNumber} (${params.accountName.toUpperCase()}) • Code: ${cleanCode}`,
        amount: params.amount,
        date: dateStr,
        time: timeStr,
        isCredit: false,
        status: 'successful',
        reference,
      };

      const existingTxRaw = localStorage.getItem(`${TRANSACTIONS_PREFIX}${currentUser.id}`);
      const currentTxList: Transaction[] = existingTxRaw ? JSON.parse(existingTxRaw) : transactions;
      const updatedTxList = [newTx, ...currentTxList];
      setTransactions(updatedTxList);
      localStorage.setItem(`${TRANSACTIONS_PREFIX}${currentUser.id}`, JSON.stringify(updatedTxList));

      return { success: true };
    } catch (e) {
      console.error('Withdraw funds error', e);
      return { success: false, message: 'An unexpected error occurred during withdrawal.' };
    }
  };

  const getUserReferrals = (): ReferralRecord[] => {
    if (!user) return [];
    try {
      const savedReferralsRaw = localStorage.getItem(REFERRALS_STORAGE_KEY);
      const allReferrals: ReferralRecord[] = savedReferralsRaw ? JSON.parse(savedReferralsRaw) : referrals;
      return allReferrals.filter((r) => r.referrerId === user.id);
    } catch {
      return [];
    }
  };

  const register = async (name: string, email: string, pin: string, inputReferralCode?: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const existingUsers: User[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

      const existing = existingUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return { success: false, message: 'An account with this email already exists. Please log in.' };
      }

      // Generate user unique referral code (e.g. 9JA-NAME-774)
      const sanitizedName = name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'VIP';
      const myReferralCode = `9JA-${sanitizedName}-${Math.floor(100 + Math.random() * 900)}`;

      const cleanRefCode = inputReferralCode ? inputReferralCode.trim().toUpperCase() : undefined;
      let matchedReferrer: User | undefined;

      if (cleanRefCode) {
        matchedReferrer = existingUsers.find(
          (u) =>
            (u.referralCode && u.referralCode.toUpperCase() === cleanRefCode) ||
            (u.membershipId && u.membershipId.toUpperCase() === cleanRefCode)
        );
      }

      const newUser: User = {
        id: 'usr_' + Date.now() + Math.random().toString(36).substring(2, 6),
        name: name.trim(),
        email: cleanEmail,
        pin: pin.trim(),
        membershipId: generateMembershipId(),
        balance: 0.0,
        availableBalance: 0.0,
        tier: 1,
        pendingEarnings: 0.0,
        referralCode: myReferralCode,
        referredBy: matchedReferrer ? matchedReferrer.referralCode || matchedReferrer.membershipId : cleanRefCode,
        referralEarnings: 0.0,
        referralCount: 0,
        createdAt: new Date().toISOString(),
      };

      existingUsers.push(newUser);

      // If registered with a valid referrer, credit ₦1,500 bonus to the referrer!
      if (matchedReferrer) {
        const refIndex = existingUsers.findIndex((u) => u.id === matchedReferrer!.id);
        if (refIndex !== -1) {
          const referrerTier = existingUsers[refIndex].tier || 1;
          const referrerTierLimit = getUserTierLimit(referrerTier);
          const bonusAmount = REFERRAL_BONUS_AMOUNT;

          let refNewBalance = existingUsers[refIndex].balance;
          let refNewPending = existingUsers[refIndex].pendingEarnings || 0;

          if (refNewBalance + bonusAmount > referrerTierLimit) {
            const room = Math.max(0, referrerTierLimit - refNewBalance);
            refNewBalance = referrerTierLimit;
            refNewPending += bonusAmount - room;
          } else {
            refNewBalance += bonusAmount;
          }

          existingUsers[refIndex] = {
            ...existingUsers[refIndex],
            balance: refNewBalance,
            availableBalance: refNewBalance,
            pendingEarnings: refNewPending,
            referralEarnings: (existingUsers[refIndex].referralEarnings || 0) + bonusAmount,
            referralCount: (existingUsers[refIndex].referralCount || 0) + 1,
          };

          // Record referral transaction for the referrer
          const now = new Date();
          const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          const reference = 'REF9JA' + Math.floor(10000000 + Math.random() * 90000000);

          const refTx: Transaction = {
            id: 'tx_ref_' + Date.now(),
            type: 'earn',
            title: 'Referral Cash Bonus',
            subtitle: `Invited new member: ${newUser.name} (+₦1,500)`,
            amount: bonusAmount,
            date: dateStr,
            time: timeStr,
            isCredit: true,
            status: 'successful',
            reference,
          };

          const refTxRaw = localStorage.getItem(`${TRANSACTIONS_PREFIX}${matchedReferrer.id}`);
          const refTxList: Transaction[] = refTxRaw ? JSON.parse(refTxRaw) : [];
          localStorage.setItem(`${TRANSACTIONS_PREFIX}${matchedReferrer.id}`, JSON.stringify([refTx, ...refTxList]));

          // Save referral log
          const newRefRecord: ReferralRecord = {
            id: 'ref_rec_' + Date.now(),
            referrerId: matchedReferrer.id,
            referrerName: matchedReferrer.name,
            referredUserId: newUser.id,
            referredUserName: newUser.name,
            referredUserEmail: newUser.email,
            bonusAmount,
            date: dateStr,
            time: timeStr,
          };

          const existingReferralsRaw = localStorage.getItem(REFERRALS_STORAGE_KEY);
          const existingReferrals: ReferralRecord[] = existingReferralsRaw ? JSON.parse(existingReferralsRaw) : [];
          const updatedReferrals = [newRefRecord, ...existingReferrals];
          localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(updatedReferrals));
          setReferrals(updatedReferrals);
        }
      }

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem(`${TRANSACTIONS_PREFIX}${newUser.id}`, JSON.stringify([]));

      setUser(newUser);
      setTransactions([]);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Failed to create account. Please try again.' };
    }
  };

  const login = async (email: string, pin: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPin = pin.trim();

      const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const existingUsers: User[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

      const foundUser = existingUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.pin === cleanPin
      );

      if (!foundUser) {
        return { success: false, message: 'Invalid email or 4-digit PIN. Please check your credentials or register.' };
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
      setUser(foundUser);

      const savedTx = localStorage.getItem(`${TRANSACTIONS_PREFIX}${foundUser.id}`);
      if (savedTx) {
        setTransactions(JSON.parse(savedTx));
      } else {
        setTransactions([]);
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Login failed. Please check your credentials.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setTransactions([]);
  };

  const getUserTierLimit = (userTier = 1): number => {
    return TIER_LIMITS[userTier] || TIER_LIMITS[1];
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'date' | 'time' | 'reference'>) => {
    const freshUserRaw = localStorage.getItem(CURRENT_USER_KEY);
    const currentUser: User | null = freshUserRaw ? JSON.parse(freshUserRaw) : user;
    if (!currentUser) return;

    const currentTier = currentUser.tier || 1;
    const tierLimit = getUserTierLimit(currentTier);
    const existingPending = currentUser.pendingEarnings || 0;

    let creditedAmount = 0;
    let addedPending = 0;
    let newBalance = currentUser.balance;
    let newPending = existingPending;

    if (txData.isCredit) {
      if (currentUser.balance >= tierLimit) {
        // Balance is already capped at or above tier limit, so entire amount goes to pending
        creditedAmount = 0;
        addedPending = txData.amount;
        newPending = existingPending + addedPending;
      } else if (currentUser.balance + txData.amount > tierLimit) {
        // Part of the amount fills the remaining tier room, excess goes to pending
        creditedAmount = tierLimit - currentUser.balance;
        addedPending = txData.amount - creditedAmount;
        newBalance = tierLimit;
        newPending = existingPending + addedPending;
      } else {
        // Fully within tier limit
        creditedAmount = txData.amount;
        newBalance = currentUser.balance + creditedAmount;
      }
    } else {
      // Debit / withdrawal
      newBalance = Math.max(0, currentUser.balance - txData.amount);
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const reference = 'TX9JA' + Math.floor(1000000000 + Math.random() * 9000000000);

    // If whole credit was moved to pending, indicate status in transaction subtitle
    let txSubtitle = txData.subtitle;
    let txStatus: 'successful' | 'pending' | 'failed' = txData.status || 'successful';
    if (txData.isCredit && addedPending > 0) {
      if (creditedAmount === 0) {
        txSubtitle = `Tier ${currentTier} Limit (₦${tierLimit.toLocaleString()}) reached • ${formatNaira(addedPending)} stored in Pending`;
        txStatus = 'pending';
      } else {
        txSubtitle = `${txData.subtitle} (₦${creditedAmount.toLocaleString()} credited, ₦${addedPending.toLocaleString()} stored in Pending)`;
      }
    }

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      ...txData,
      subtitle: txSubtitle,
      status: txStatus,
      date: dateStr,
      time: timeStr,
      reference,
    };

    const existingTxRaw = localStorage.getItem(`${TRANSACTIONS_PREFIX}${currentUser.id}`);
    const currentTxList: Transaction[] = existingTxRaw ? JSON.parse(existingTxRaw) : transactions;
    const updatedTxList = [newTx, ...currentTxList];
    setTransactions(updatedTxList);
    localStorage.setItem(`${TRANSACTIONS_PREFIX}${currentUser.id}`, JSON.stringify(updatedTxList));

    const updatedUser: User = {
      ...currentUser,
      balance: newBalance,
      availableBalance: newBalance,
      tier: currentTier,
      pendingEarnings: newPending,
    };

    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // Update in users table
    const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
    if (existingUsersRaw) {
      const existingUsers: User[] = JSON.parse(existingUsersRaw);
      const idx = existingUsers.findIndex((u) => u.id === currentUser.id);
      if (idx !== -1) {
        existingUsers[idx] = updatedUser;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
      }
    }
  };

  // Upgrade account tier (Tier 2 or Tier 3) and automatically credit held pending earnings into new balance
  const upgradeTier = (
    targetTier: number,
    paymentReceiptName = 'Tier_Upgrade_Receipt.png'
  ): { success: boolean; message?: string } => {
    try {
      const freshUserRaw = localStorage.getItem(CURRENT_USER_KEY);
      const currentUser: User | null = freshUserRaw ? JSON.parse(freshUserRaw) : user;
      if (!currentUser) return { success: false, message: 'User session not found.' };

      const currentTier = currentUser.tier || 1;
      if (targetTier <= currentTier) {
        return { success: false, message: `Your account is already at Tier ${currentTier} or higher.` };
      }

      const cost = TIER_UPGRADE_PRICES[targetTier] || 0;
      const newLimit = TIER_LIMITS[targetTier] || TIER_LIMITS[3];
      const heldPending = currentUser.pendingEarnings || 0;

      // Calculate how much pending earnings can now be moved into balance
      const availableRoomInNewTier = Math.max(0, newLimit - currentUser.balance);
      const pendingToRelease = Math.min(heldPending, availableRoomInNewTier);
      const remainingPending = heldPending - pendingToRelease;
      const finalBalance = currentUser.balance + pendingToRelease;

      const updatedUser: User = {
        ...currentUser,
        tier: targetTier,
        balance: finalBalance,
        availableBalance: finalBalance,
        pendingEarnings: remainingPending,
      };

      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      // Update in users table
      const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      if (existingUsersRaw) {
        const existingUsers: User[] = JSON.parse(existingUsersRaw);
        const idx = existingUsers.findIndex((u) => u.id === currentUser.id);
        if (idx !== -1) {
          existingUsers[idx] = updatedUser;
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
        }
      }

      // Record upgrade transaction
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const reference = 'UPG9JA' + Math.floor(10000000 + Math.random() * 90000000);

      const newTx: Transaction = {
        id: 'tx_upg_' + Date.now(),
        type: 'upgrade',
        title: `Account Upgrade to Tier ${targetTier}`,
        subtitle: `Limit increased to ₦${newLimit.toLocaleString()}${
          pendingToRelease > 0 ? ` • ₦${pendingToRelease.toLocaleString()} pending earnings unlocked!` : ''
        }`,
        amount: cost,
        date: dateStr,
        time: timeStr,
        isCredit: false,
        status: 'successful',
        reference,
      };

      const existingTxRaw = localStorage.getItem(`${TRANSACTIONS_PREFIX}${currentUser.id}`);
      const currentTxList: Transaction[] = existingTxRaw ? JSON.parse(existingTxRaw) : transactions;
      const updatedTxList = [newTx, ...currentTxList];
      setTransactions(updatedTxList);
      localStorage.setItem(`${TRANSACTIONS_PREFIX}${currentUser.id}`, JSON.stringify(updatedTxList));

      // Broadcast notification
      sendBroadcastNotification(
        `Account Upgraded to Tier ${targetTier}! 🚀`,
        `Congratulations! Your wallet holding capacity is now ₦${newLimit.toLocaleString()}.${
          pendingToRelease > 0
            ? ` We have also credited ₦${pendingToRelease.toLocaleString()} of your pending earnings into your balance!`
            : ''
        }`,
        'success'
      );

      return { success: true };
    } catch (e) {
      console.error('Upgrade tier error', e);
      return { success: false, message: 'Failed to complete tier upgrade.' };
    }
  };

  const clearTransactions = () => {
    if (!user) return;
    setTransactions([]);
    localStorage.setItem(`${TRANSACTIONS_PREFIX}${user.id}`, JSON.stringify([]));
  };

  const formatNaira = (amount: number) => {
    return '₦ ' + amount.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        transactions,
        notifications,
        companyAccount,
        depositRequests,
        referrals,
        isAuthenticated: !!user,
        isBalanceHidden,
        toggleBalanceVisibility,
        register,
        login,
        logout,
        addTransaction,
        formatNaira,
        clearTransactions,
        getAllRegisteredUsers,
        sendBroadcastNotification,
        deleteNotification,
        updateCompanyAccount,
        submitDepositRequest,
        approveDepositRequest,
        declineDepositRequest,
        consumeQuickCode,
        withdrawFunds,
        upgradeTier,
        getUserTierLimit,
        getUserReferrals,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

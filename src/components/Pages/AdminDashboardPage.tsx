import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { User, AppNotification, CompanyAccount, DepositRequest } from '../../types/index.ts';
import {
  ArrowLeft,
  Shield,
  Users,
  Wallet,
  Send,
  Bell,
  Search,
  CheckCircle2,
  Lock,
  KeyRound,
  AlertTriangle,
  LogOut,
  Sparkles,
  Trash2,
  TrendingUp,
  Landmark,
  Save,
  Check,
  Building2,
  Clock,
  CheckCheck,
  XCircle,
  FileText,
  Filter,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onBack: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onBack }) => {
  const {
    user,
    getAllRegisteredUsers,
    notifications,
    sendBroadcastNotification,
    deleteNotification,
    formatNaira,
    companyAccount,
    updateCompanyAccount,
    depositRequests,
    approveDepositRequest,
    declineDepositRequest,
  } = useAuth();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'account' | 'broadcast' | 'history'>('approvals');

  // Company Account Form state
  const [accountNumber, setAccountNumber] = useState(companyAccount.accountNumber);
  const [bankName, setBankName] = useState(companyAccount.bankName);
  const [accountName, setAccountName] = useState(companyAccount.accountName);
  const [accountSaveMsg, setAccountSaveMsg] = useState('');

  // Deposit Request management
  const [selectedDeclineReqId, setSelectedDeclineReqId] = useState<string | null>(null);
  const [declineReasonInput, setDeclineReasonInput] = useState('Receipt could not be verified. Please upload full transfer screenshot.');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [depositFilter, setDepositFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastDesc, setBroadcastDesc] = useState('');
  const [broadcastType, setBroadcastType] = useState<'admin' | 'info' | 'alert' | 'success'>('admin');
  const [broadcastSuccessMsg, setBroadcastSuccessMsg] = useState('');

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');

  const registeredUsers: User[] = getAllRegisteredUsers();
  const allUsersList = registeredUsers.length > 0 ? registeredUsers : (user ? [user] : []);
  const totalRegisteredAmount = allUsersList.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  const pendingDepositsCount = depositRequests.filter((r) => r.status === 'pending').length;

  const filteredDeposits = depositRequests.filter((r) => {
    if (depositFilter === 'all') return true;
    return r.status === depositFilter;
  });

  const filteredUsers = allUsersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.membershipId && u.membershipId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKeyInput.trim() === 'MACELL999') {
      setIsAdminAuthenticated(true);
      setLoginError('');
      // Sync form with current account
      setAccountNumber(companyAccount.accountNumber);
      setBankName(companyAccount.bankName);
      setAccountName(companyAccount.accountName);
    } else {
      setLoginError('Invalid Admin Key. Please check the access key.');
    }
  };

  const handleSaveCompanyAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim() || !bankName.trim() || !accountName.trim()) {
      return;
    }

    updateCompanyAccount({
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
    });

    setAccountSaveMsg('Company account details updated across Quick Code & Deposit pages!');
    setTimeout(() => setAccountSaveMsg(''), 4000);
  };

  const handleApproveDeposit = (requestId: string) => {
    const success = approveDepositRequest(requestId);
    if (success) {
      setActionSuccessMsg('Deposit approved and credited to user wallet!');
      setTimeout(() => setActionSuccessMsg(''), 4000);
    }
  };

  const handleConfirmDecline = (requestId: string) => {
    const success = declineDepositRequest(requestId, declineReasonInput);
    if (success) {
      setSelectedDeclineReqId(null);
      setActionSuccessMsg('Deposit declined and notification sent to user.');
      setTimeout(() => setActionSuccessMsg(''), 4000);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastDesc.trim()) {
      return;
    }

    const ok = sendBroadcastNotification(broadcastTitle, broadcastDesc, broadcastType);
    if (ok) {
      setBroadcastSuccessMsg('Broadcast sent successfully to all registered users!');
      setBroadcastTitle('');
      setBroadcastDesc('');
      setTimeout(() => setBroadcastSuccessMsg(''), 4000);
    }
  };

  // If Admin is NOT yet authenticated with key MACELL999
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen pb-12 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 pt-2 pb-3 border-b border-stone-800">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#16171d] border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:border-amber-500/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-1.5">
              Government &amp; Tasks <Shield className="w-4 h-4 text-amber-400" />
            </h1>
            <p className="text-xs text-stone-400">Restricted Administration Gateway</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-6 rounded-3xl bg-[#14151b] border border-stone-800 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Admin Authentication</h2>
            <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
              Please enter your authorized administrative security key to access the control dashboard.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 pt-2">
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <input
                type="password"
                placeholder="Enter Admin Key"
                value={adminKeyInput}
                onChange={(e) => {
                  setAdminKeyInput(e.target.value);
                  setLoginError('');
                }}
                className="w-full pl-10 pr-4 py-3 bg-[#1c1e26] border border-stone-800 rounded-xl text-white text-sm font-mono tracking-widest focus:border-amber-500 focus:outline-none placeholder-stone-600 text-center"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock Admin Dashboard</span>
              <Shield className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard View (Authenticated with MACELL999)
  return (
    <div className="min-h-screen pb-16 space-y-4 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-[#16171d] border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:border-amber-500/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5">
              Admin Control Center <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono">LIVE</span>
            </h1>
            <p className="text-[11px] text-stone-400">Authenticated Key: MACELL999</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdminAuthenticated(false)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Total Registered Amount */}
        <div className="p-3.5 rounded-2xl bg-[#14151b] border border-stone-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Total Users Balance</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-extrabold text-white truncate">
            {formatNaira(totalRegisteredAmount)}
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> Cumulative Holdings
          </span>
        </div>

        {/* Registered Users Count */}
        <div className="p-3.5 rounded-2xl bg-[#14151b] border border-stone-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-extrabold text-white">
            {pendingDepositsCount} <span className="text-xs font-normal text-stone-400">Awaiting</span>
          </div>
          <span className="text-[10px] text-amber-400 flex items-center gap-1 mt-1 font-semibold">
            <Sparkles className="w-3 h-3" /> {allUsersList.length} Total Users
          </span>
        </div>
      </div>

      {/* Navigation Pills (5 Tabs: Approvals, Users, Company Account, Broadcast, History) */}
      <div className="grid grid-cols-5 p-1 rounded-xl bg-[#15161c] border border-stone-800 text-[10px] gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          className={`py-2 px-1 rounded-lg font-semibold transition-all flex flex-col items-center justify-center gap-1 relative ${
            activeTab === 'approvals'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-bold'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Approvals</span>
          {pendingDepositsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-bold text-[9px] flex items-center justify-center">
              {pendingDepositsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`py-2 px-1 rounded-lg font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
            activeTab === 'users'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-bold'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Users</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`py-2 px-1 rounded-lg font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
            activeTab === 'account'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-bold'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Account</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('broadcast')}
          className={`py-2 px-1 rounded-lg font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
            activeTab === 'broadcast'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-bold'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`py-2 px-1 rounded-lg font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
            activeTab === 'history'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-bold'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifs</span>
        </button>
      </div>

      {/* TAB 1: DEPOSIT APPROVALS WORKFLOW */}
      {activeTab === 'approvals' && (
        <div className="space-y-3.5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Deposit Review &amp; Approvals
              </h3>
              <p className="text-[11px] text-stone-400">Review uploaded deposit payments and credit user balances.</p>
            </div>
            {/* Filter pills */}
            <div className="flex gap-1 bg-[#14151b] p-1 rounded-lg border border-stone-800 text-[10px]">
              {(['all', 'pending', 'approved', 'declined'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setDepositFilter(f)}
                  className={`px-2 py-0.5 rounded capitalize font-semibold transition-colors ${
                    depositFilter === f ? 'bg-amber-400 text-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {actionSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {/* Decline Reason Modal Box if active */}
          {selectedDeclineReqId && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Decline Deposit Request
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDeclineReqId(null)}
                  className="text-stone-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-stone-300 font-semibold mb-1">
                  Reason for Decline (Sent to User):
                </label>
                <textarea
                  rows={2}
                  value={declineReasonInput}
                  onChange={(e) => setDeclineReasonInput(e.target.value)}
                  className="w-full p-2.5 bg-[#1c1e26] border border-red-500/30 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDeclineReqId(null)}
                  className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDecline(selectedDeclineReqId)}
                  className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          )}

          {/* Deposit Requests List */}
          <div className="space-y-3">
            {filteredDeposits.length === 0 ? (
              <div className="p-8 text-center bg-[#14151b] rounded-2xl border border-stone-800 text-stone-500 text-xs">
                No deposit requests found in &quot;{depositFilter}&quot; status.
              </div>
            ) : (
              filteredDeposits.map((req) => (
                <div
                  key={req.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    req.status === 'pending'
                      ? 'bg-[#14151b] border-amber-500/40 shadow-md shadow-amber-500/5'
                      : req.status === 'approved'
                      ? 'bg-[#14151b] border-emerald-500/30'
                      : 'bg-[#14151b] border-stone-800 opacity-80'
                  }`}
                >
                  {/* Top Bar with user & amount */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{req.userName}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            req.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : req.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 block">{req.userEmail}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-amber-400 block">
                        {formatNaira(req.amount)}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">{req.reference}</span>
                    </div>
                  </div>

                  {/* Receipt & Bank Details */}
                  <div className="p-3 rounded-xl bg-[#1c1e26] border border-stone-800/80 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-stone-400 block">Uploaded Receipt</span>
                        <span className="text-stone-200 font-medium truncate max-w-[170px] block">
                          {req.receiptName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-stone-400">
                      <div>Via {req.bankName}</div>
                      <div>{new Date(req.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>

                  {/* Decline reason note if declined */}
                  {req.status === 'declined' && req.declineReason && (
                    <div className="text-[11px] text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                      <strong>Decline Reason:</strong> {req.declineReason}
                    </div>
                  )}

                  {/* Action Buttons for Pending State */}
                  {req.status === 'pending' && (
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedDeclineReqId(req.id)}
                        className="flex-1 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApproveDeposit(req.id)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Approve &amp; Credit</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED USERS & BALANCES */}
      {activeTab === 'users' && (
        <div className="space-y-3 animate-in fade-in">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search user name, email, NUBAN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#14151b] border border-stone-800 rounded-xl text-white text-xs placeholder-stone-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2.5">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center bg-[#14151b] rounded-2xl border border-stone-800 text-stone-500 text-xs">
                No registered users found matching your search.
              </div>
            ) : (
              filteredUsers.map((u, i) => (
                <div
                  key={u.id || i}
                  className="p-3.5 rounded-2xl bg-[#14151b] border border-stone-800 hover:border-amber-500/30 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs uppercase">
                      {u.name.substring(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{u.name}</span>
                        {u.id === user?.id && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400">{u.email}</div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        Member ID: <span className="text-stone-300">{u.membershipId || u.id}</span> • Registered Earner
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-stone-400">Account Amount</div>
                    <div className="text-sm font-bold text-amber-400">{formatNaira(u.balance || 0)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: COMPANY ACCOUNT SETTINGS */}
      {activeTab === 'account' && (
        <div className="p-4 rounded-2xl bg-[#14151b] border border-stone-800 space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              Company Payment Account Configuration
            </h3>
            <p className="text-[11px] text-stone-400">
              Update the official bank details displayed on the <strong>Quick Code Purchase</strong> and <strong>Deposit</strong> pages.
            </p>
          </div>

          {accountSaveMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{accountSaveMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveCompanyAccount} className="space-y-3.5">
            {/* Bank Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-300">Bank Name</label>
                <div className="flex gap-1">
                  {['Moniepoint MFB', 'Zenith Bank', 'Kuda MFB', 'GTBank'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBankName(b)}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800 hover:bg-amber-500/20 text-amber-400 transition-colors"
                    >
                      {b.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                placeholder="e.g. Moniepoint MFB or Zenith Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-3 bg-[#1c1e26] border border-stone-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">10-Digit Account Number</label>
              <input
                type="text"
                maxLength={10}
                placeholder="e.g. 9048291048"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full p-3 bg-[#1c1e26] border border-stone-800 rounded-xl text-white text-sm font-mono tracking-wider focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Beneficiary Account Name</label>
              <input
                type="text"
                placeholder="e.g. 9jacash Official Services"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full p-3 bg-[#1c1e26] border border-stone-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            {/* Preview Card */}
            <div className="p-3.5 rounded-xl bg-[#1c1e26] border border-stone-700/60 space-y-2">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
                Live App Preview (Quick Code &amp; Deposit):
              </span>
              <div className="text-xs font-bold text-white flex justify-between">
                <span>Account Number:</span>
                <span className="font-mono text-amber-400">{accountNumber || '0000000000'}</span>
              </div>
              <div className="text-xs font-semibold text-stone-300 flex justify-between">
                <span>Bank:</span>
                <span>{bankName || 'Not specified'}</span>
              </div>
              <div className="text-xs font-semibold text-stone-300 flex justify-between">
                <span>Account Name:</span>
                <span className="truncate max-w-[180px]">{accountName || 'Not specified'}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Apply Company Account</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: SEND BROADCAST NOTIFICATION */}
      {activeTab === 'broadcast' && (
        <div className="p-4 rounded-2xl bg-[#14151b] border border-stone-800 space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Send className="w-4 h-4 text-amber-400" />
              Broadcast Notification to All Registered Users
            </h3>
            <p className="text-[11px] text-stone-400">
              Send announcements, alerts, or promo notices directly to all {allUsersList.length} users.
            </p>
          </div>

          {broadcastSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{broadcastSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            {/* Category / Type */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Notification Priority &amp; Type</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { key: 'admin', label: 'Admin Note' },
                  { key: 'info', label: 'Info Update' },
                  { key: 'success', label: 'Bonus/Promo' },
                  { key: 'alert', label: 'Security Alert' },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setBroadcastType(t.key as any)}
                    className={`py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${
                      broadcastType === t.key
                        ? 'bg-amber-400 text-black border-amber-400 font-bold'
                        : 'bg-[#1c1e26] text-stone-400 border-stone-800 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Notification Title</label>
              <input
                type="text"
                placeholder="e.g. Weekend Cash Reward Active! 🎁"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full p-3 bg-[#1c1e26] border border-stone-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none placeholder-stone-600"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Message Content (for all users)</label>
              <textarea
                rows={3}
                placeholder="Type the message that will be broadcasted and displayed on all users' notifications tab..."
                value={broadcastDesc}
                onChange={(e) => setBroadcastDesc(e.target.value)}
                className="w-full p-3 bg-[#1c1e26] border border-stone-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none placeholder-stone-600 resize-none"
                required
              />
            </div>

            {/* Preview */}
            {broadcastTitle && (
              <div className="p-3 rounded-xl bg-[#1c1e26] border border-stone-700/60 space-y-1">
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">Live User Preview:</span>
                <div className="text-xs font-bold text-white">{broadcastTitle}</div>
                <div className="text-[11px] text-stone-400">{broadcastDesc || 'Your message will show here...'}</div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to All Users ({allUsersList.length})</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: NOTIFICATIONS & BROADCAST HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-white">Active System Notifications</span>
            <span className="text-[11px] text-stone-400">{notifications.length} Total</span>
          </div>

          {notifications.map((n: AppNotification) => (
            <div
              key={n.id}
              className="p-3.5 rounded-2xl bg-[#14151b] border border-stone-800 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 border border-stone-700">
                      {n.type || 'admin'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">{n.desc}</p>
                  <span className="text-[10px] text-stone-500 mt-1 block">{n.time} • {n.date}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteNotification(n.id)}
                className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors flex-shrink-0"
                title="Delete notification"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

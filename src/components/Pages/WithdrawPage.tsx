import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ArrowLeft, CreditCard, Landmark, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle, Hash } from 'lucide-react';

interface WithdrawPageProps {
  onBack: () => void;
}

export const WithdrawPage: React.FC<WithdrawPageProps> = ({ onBack }) => {
  const { user, formatNaira, withdrawFunds } = useAuth();
  const [selectedBank, setSelectedBank] = useState('GTBank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [quickCode, setQuickCode] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [withdrawnAmount, setWithdrawnAmount] = useState<number | null>(null);

  if (!user) return null;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (numAmount > user.balance) {
      setError('Insufficient funds in your 9jacash balance');
      return;
    }
    if (accountNumber.length !== 10) {
      setError('Please enter a valid 10-digit NUBAN account number');
      return;
    }
    if (!accountName.trim()) {
      setError('Please enter the account name');
      return;
    }
    if (!quickCode.trim()) {
      setError('Please enter your Quick Code to authorize withdrawal');
      return;
    }

    // Process withdrawal atomically (verifies quick code, decrements usage/expires it, updates balance & logs tx)
    const result = withdrawFunds({
      bank: selectedBank,
      accountNumber,
      accountName,
      amount: numAmount,
      quickCode,
    });

    if (!result.success) {
      setError(result.message || 'Invalid or expired Quick Code. Please enter a valid active Quick Code.');
      return;
    }

    setWithdrawnAmount(numAmount);
    setIsSuccess(true);
  };

  const setPresetPercentage = (pct: number) => {
    const val = Math.floor(user.balance * pct);
    setAmount(val.toString());
  };

  return (
    <div className="min-h-screen pb-12 space-y-4">
      {/* Top Header */}
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
            Withdraw to Bank <CreditCard className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-xs text-stone-400">Transfer funds using your Quick Code authorization</p>
        </div>
      </div>

      {isSuccess && withdrawnAmount ? (
        <div className="p-6 rounded-3xl bg-[#14151b] border border-emerald-500/30 text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-bold text-white">Withdrawal Sent!</h2>
          <p className="text-xs text-stone-400">
            {formatNaira(withdrawnAmount)} sent to {selectedBank} ({accountNumber})
          </p>

          <div className="p-4 rounded-2xl bg-[#1c1e26] border border-stone-800 text-2xl font-extrabold text-white">
            -{formatNaira(withdrawnAmount)}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 rounded-xl bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-400/20"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleWithdraw} className="space-y-4">
          {/* Balance card */}
          <div className="p-4 rounded-2xl bg-[#15161c] border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-400 block">Available for Withdrawal</span>
              <span className="text-xl font-bold text-white">{formatNaira(user.balance)}</span>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
              Instant Settlement
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Bank Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">Destination Bank</label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full p-3.5 bg-[#1c1e26] border border-stone-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
            >
              <option value="GTBank">Guaranty Trust Bank (GTBank)</option>
              <option value="Access Bank">Access Bank</option>
              <option value="Zenith Bank">Zenith Bank</option>
              <option value="First Bank of Nigeria">First Bank of Nigeria</option>
              <option value="United Bank for Africa">United Bank for Africa (UBA)</option>
              <option value="Kuda Bank">Kuda Microfinance Bank</option>
              <option value="OPay">OPay Digital Services</option>
              <option value="Palmpay">Palmpay</option>
              <option value="Stanbic IBTC">Stanbic IBTC Bank</option>
              <option value="Fidelity Bank">Fidelity Bank</option>
            </select>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">10-Digit Account Number</label>
            <input
              type="text"
              maxLength={10}
              placeholder="0123456789"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full p-3.5 bg-[#1c1e26] border border-stone-800 rounded-xl text-white text-sm tracking-wider placeholder-stone-500 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          {/* Account Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">Account Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full p-3.5 bg-[#1c1e26] border border-stone-800 rounded-xl text-white text-sm uppercase placeholder-stone-500 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-300">Amount (₦)</label>
              <div className="flex gap-1">
                {[0.25, 0.5, 1].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setPresetPercentage(pct)}
                    className="text-[10px] px-2 py-0.5 rounded bg-stone-800 hover:bg-amber-500/20 text-amber-400 font-semibold transition-colors"
                  >
                    {pct === 1 ? '100%' : `${pct * 100}%`}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-amber-400">₦</span>
              <input
                type="number"
                min="100"
                max={user.balance}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#1c1e26] border border-stone-800 rounded-xl text-white text-base font-bold placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Quick Code Authorization */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center justify-between">
              <span>Quick Code Authorization</span>
              <span className="text-[10px] text-amber-400">Enter your Quick Code</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <input
                type="text"
                placeholder="Enter Quick Code"
                value={quickCode}
                onChange={(e) => setQuickCode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1c1e26] border border-stone-800 rounded-xl text-white text-sm font-bold tracking-widest placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
            {/* Quick autofill helper chips if user has active quick codes */}
            {user?.quickCodes && user.quickCodes.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-stone-400">Tap to insert:</span>
                {user.quickCodes.map((item, idx) => {
                  const isStr = typeof item === 'string';
                  const code = isStr ? item : item.code;
                  const left = isStr ? 1 : item.withdrawalsLeft;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQuickCode(code)}
                      className={`text-[10px] px-2 py-1 rounded-lg font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                        quickCode === code
                          ? 'bg-amber-400 text-black border-amber-400'
                          : 'bg-[#181920] text-amber-400 border-amber-500/30 hover:border-amber-400'
                      }`}
                    >
                      <span>{code}</span>
                      <span className="text-[9px] opacity-80">({left} left)</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Complete Withdrawal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};

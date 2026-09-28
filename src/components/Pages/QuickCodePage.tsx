import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ArrowLeft, Hash, Copy, Check, ShieldCheck, CheckCircle2, Upload, ArrowRight, AlertTriangle } from 'lucide-react';

interface QuickCodePageProps {
  onBack: () => void;
  onGoToWithdraw?: () => void;
}

interface Plan {
  id: string;
  name: string;
  amount: number;
  withdrawals: number;
}

export const QuickCodePage: React.FC<QuickCodePageProps> = ({ onBack, onGoToWithdraw }) => {
  const { user, formatNaira, companyAccount, submitDepositRequest } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');
  const [copied, setCopied] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const plans: Plan[] = [
    { id: '1', name: '1 Withdrawal Plan', amount: 7800, withdrawals: 1 },
    { id: '2', name: '3 Withdrawals Plan', amount: 10300, withdrawals: 3 },
    { id: '3', name: '6 Withdrawals Plan', amount: 15600, withdrawals: 6 },
  ];

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setStep('payment');
  };

  const handleUploadPayment = (fileName = 'QuickCode_Payment_Receipt.png') => {
    if (selectedPlan) {
      submitDepositRequest(selectedPlan.amount, fileName, selectedPlan.name, selectedPlan.withdrawals);
    }
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setStep('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-12 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-2 pb-3 border-b border-stone-800">
        <button
          type="button"
          onClick={() => {
            if (step === 'payment') setStep('select');
            else onBack();
          }}
          className="w-10 h-10 rounded-full bg-[#16171d] border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:border-amber-500/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-1.5">
            Quick Code Purchase <Hash className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-xs text-stone-400">
            {step === 'select' && 'Select a plan for your withdrawal code'}
            {step === 'payment' && 'Make payment to company account'}
            {step === 'success' && 'Quick Code Generated Successfully'}
          </p>
        </div>
      </div>

      {/* STEP 1: Select Plan */}
      {step === 'select' && (
        <div className="space-y-3">
          {/* If user has active quick codes, show them first with copy button */}
          {user?.quickCodes && user.quickCodes.length > 0 && (
            <div className="p-4 rounded-3xl bg-[#171922] border border-amber-500/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Your Active Quick Code(s)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Active
                </span>
              </div>
              <div className="space-y-2">
                {user.quickCodes.map((item, idx) => {
                  const isStr = typeof item === 'string';
                  const code = isStr ? item : item.code;
                  const planName = isStr ? 'Quick Code' : item.planName;
                  const left = isStr ? 1 : item.withdrawalsLeft;

                  return (
                    <div key={idx} className="p-3 rounded-2xl bg-[#111217] border border-stone-800 flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-white tracking-widest block">{code}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-stone-400">{planName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold">
                            {left} withdrawal{left > 1 ? 's' : ''} left
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(code, `page_qc_${idx}`)}
                          className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        >
                          {copied === `page_qc_${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied === `page_qc_${idx}` ? 'Copied' : 'Copy'}</span>
                        </button>
                        {onGoToWithdraw && (
                          <button
                            type="button"
                            onClick={onGoToWithdraw}
                            className="py-1.5 px-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Withdraw</span>
                            <ArrowRight className="w-3 h-3 text-amber-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
            <h3 className="font-bold text-amber-400">Withdrawal Quick Code Required</h3>
            <p className="text-stone-300 leading-relaxed">
              To perform a bank withdrawal on 9jacash, you need an active Quick Code. Select any plan below to proceed with purchase.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {plans.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectPlan(p)}
                className="p-4 rounded-3xl bg-[#15161c] border border-stone-800 hover:border-amber-500/50 hover:bg-[#1a1c24] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Valid for {p.withdrawals} successful withdrawal{p.withdrawals > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-amber-400 block">
                    {formatNaira(p.amount)}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Select Plan
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Payment Details & Upload */}
      {step === 'payment' && selectedPlan && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-3xl bg-[#15161c] border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-xs text-stone-400">Selected Plan</span>
              <span className="text-xs font-bold text-amber-400">{selectedPlan.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400">Amount to Pay</span>
              <span className="text-lg font-extrabold text-white">{formatNaira(selectedPlan.amount)}</span>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex gap-2.5 items-start">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-red-400">Important Payment Notice</p>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Do NOT use OPay or Palmpay to make payments for quick code purchase. You can use any other banks like Moniepoint, Zenith Bank or even a POS. Uploading wrong payment receipt can lead to account ban.
              </p>
            </div>
          </div>

          {/* Dynamic Company Account Details (Account Number, Bank Name, Account Name) */}
          <div className="p-5 rounded-3xl bg-[#15161c] border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Company Account Details
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Official Account
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#1c1e26] border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-stone-500 block font-semibold">Account Number</span>
                <span className="text-lg font-bold text-white tracking-wider">{companyAccount.accountNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(companyAccount.accountNumber, 'acc')}
                className="py-1.5 px-3 rounded-xl bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-amber-300 transition-colors"
              >
                {copied === 'acc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'acc' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-[#1c1e26] border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-stone-500 block font-semibold">Bank Name</span>
                <span className="text-sm font-bold text-white">{companyAccount.bankName}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(companyAccount.bankName, 'bank')}
                className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400"
              >
                {copied === 'bank' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-[#1c1e26] border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-stone-500 block font-semibold">Account Name</span>
                <span className="text-sm font-bold text-white">{companyAccount.accountName}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(companyAccount.accountName, 'name')}
                className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400"
              >
                {copied === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Upload Receipt Section */}
          <div className="p-5 rounded-3xl bg-[#15161c] border border-stone-800 space-y-3">
            <span className="text-xs font-bold text-white block">Upload Payment Receipt</span>
            <label className="border-2 border-dashed border-stone-700 hover:border-amber-500 rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-colors bg-[#1c1e26]/50 block">
              <Upload className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs text-stone-300 font-semibold">Click to upload payment screenshot</p>
              <p className="text-[10px] text-stone-500">PNG, JPG or PDF up to 10MB</p>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleUploadPayment(e.target.files[0].name);
                  }
                }}
              />
            </label>

            <button
              type="button"
              disabled={isUploading}
              onClick={() => handleUploadPayment('QuickCode_Payment_Receipt.png')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 disabled:opacity-50 text-black font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isUploading ? (
                <span>Verifying payment &amp; activating code...</span>
              ) : (
                <>
                  <span>Upload &amp; Activate Quick Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Pending Admin Approval */}
      {step === 'success' && (
        <div className="p-6 rounded-3xl bg-[#15161c] border border-amber-500/40 text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-bold text-white">Receipt Submitted for Review</h2>
          <p className="text-xs text-stone-300 leading-relaxed max-w-xs mx-auto">
            Your payment receipt has been submitted to the admin dashboard for verification. Once approved by an administrator, your Quick Code will be issued and appear on your dashboard.
          </p>

          <div className="p-4 rounded-2xl bg-[#1c1e26] border border-stone-800 text-xs text-amber-400 font-semibold">
            Status: Awaiting Admin Approval
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs shadow-md shadow-amber-400/20 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

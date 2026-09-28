import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Landmark, Mail, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your registered email address');
      return;
    }
    if (pin.length !== 4) {
      setError('Please enter your 4-digit PIN');
      return;
    }

    setIsLoading(true);
    const result = await login(email, pin);
    setIsLoading(false);

    if (!result.success) {
      setError(result.message || 'Login failed. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0b0c0e]">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] w-80 h-80 bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-[#131418] border border-stone-800 rounded-3xl p-7 shadow-2xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#22242b] to-[#121316] border border-amber-500/30 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/10">
            <Landmark className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
            9ja<span className="text-amber-400">cash</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">Your goals. Our priority.</p>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-lg font-bold text-white">Welcome back</h2>
          <p className="text-xs text-stone-400 mt-0.5">Enter your registered email and 4-digit PIN to login</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <Mail className="w-4 h-4 text-amber-500/80" />
              </div>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1c1e24] border border-stone-800 rounded-xl text-white text-sm placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
                required
              />
            </div>
          </div>

          {/* 4-digit PIN */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-300">4-Digit Security PIN</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <KeyRound className="w-4 h-4 text-amber-500/80" />
              </div>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={handlePinChange}
                className="w-full pl-10 pr-4 py-3 bg-[#1c1e24] border border-stone-800 rounded-xl text-white text-base tracking-widest placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all font-bold"
                required
              />
            </div>
            {/* PIN digits indicator */}
            <div className="flex gap-2 mt-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i < pin.length ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'bg-stone-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="mt-6 text-center">
          <p className="text-xs text-stone-400">
            Don&apos;t have an account yet?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-amber-400 font-semibold hover:underline ml-1"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Security watermark */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500/70" />
          <span>Safe • Secure • Always</span>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Register } from './components/Auth/Register.tsx';
import { Login } from './components/Auth/Login.tsx';
import { Header } from './components/Dashboard/Header.tsx';
import { BalanceCard } from './components/Dashboard/BalanceCard.tsx';
import { QuickActions } from './components/Dashboard/QuickActions.tsx';
import { AccountCards } from './components/Dashboard/AccountCards.tsx';
import { CashbackBanner } from './components/Dashboard/CashbackBanner.tsx';
import { RecentTransactions } from './components/Dashboard/RecentTransactions.tsx';
import { BottomNav } from './components/Dashboard/BottomNav.tsx';
import { CardsTab } from './components/Tabs/CardsTab.tsx';
import { PaymentsTab } from './components/Tabs/PaymentsTab.tsx';
import { SupportTab } from './components/Tabs/SupportTab.tsx';
import { MoreTab } from './components/Tabs/MoreTab.tsx';
import { EarnPage } from './components/Pages/EarnPage.tsx';
import { QuickCodePage } from './components/Pages/QuickCodePage.tsx';
import { DepositPage } from './components/Pages/DepositPage.tsx';
import { WithdrawPage } from './components/Pages/WithdrawPage.tsx';
import { AccountDetailsPage } from './components/Pages/AccountDetailsPage.tsx';
import { TransactionHistoryPage } from './components/Pages/TransactionHistoryPage.tsx';
import { NotificationsPage } from './components/Pages/NotificationsPage.tsx';
import { SettingsPage } from './components/Pages/SettingsPage.tsx';
import { TermsPage } from './components/Pages/TermsPage.tsx';
import { AdminDashboardPage } from './components/Pages/AdminDashboardPage.tsx';
import { LiveChatPage } from './components/Pages/LiveChatPage.tsx';
import { UpgradeTierPage } from './components/Pages/UpgradeTierPage.tsx';
import { ReferralsPage } from './components/Pages/ReferralsPage.tsx';
import { ActiveTab, CurrentScreen, Transaction } from './types/index.ts';

const DashboardContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('dashboard');
  const [selectedTxForPage, setSelectedTxForPage] = useState<Transaction | null>(null);

  const handleOpenTransaction = (tx: Transaction) => {
    setSelectedTxForPage(tx);
    setCurrentScreen('transaction_history');
  };

  const handleQuickAction = (action: 'earn' | 'deposit' | 'withdraw' | 'quickcode') => {
    if (action === 'earn') setCurrentScreen('earn');
    else if (action === 'deposit') setCurrentScreen('deposit');
    else if (action === 'withdraw') setCurrentScreen('withdraw');
    else if (action === 'quickcode') setCurrentScreen('quickcode');
  };

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-stone-100 selection:bg-amber-500 selection:text-black flex justify-center">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden max-w-lg mx-auto">
        <div className="absolute top-10 right-[-10%] w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[-15%] w-80 h-80 bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md min-h-screen px-4 pt-3 pb-24 flex flex-col space-y-4">
        {/* Render Dedicated Full Page Screens if active */}
        {currentScreen === 'earn' && (
          <EarnPage onBack={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'quickcode' && (
          <QuickCodePage
            onBack={() => setCurrentScreen('dashboard')}
            onGoToWithdraw={() => setCurrentScreen('withdraw')}
          />
        )}

        {currentScreen === 'deposit' && (
          <DepositPage onBack={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'withdraw' && (
          <WithdrawPage onBack={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'account_details' && (
          <AccountDetailsPage onBack={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'transaction_history' && (
          <TransactionHistoryPage
            onBack={() => {
              setCurrentScreen('dashboard');
              setSelectedTxForPage(null);
            }}
            initialSelectedTx={selectedTxForPage}
          />
        )}

        {currentScreen === 'notifications' && (
          <NotificationsPage onBack={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'settings' && (
          <SettingsPage
            onBack={() => setCurrentScreen('dashboard')}
            onOpenTerms={() => setCurrentScreen('terms')}
          />
        )}

        {currentScreen === 'terms' && (
          <TermsPage onBack={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'admin' && (
          <AdminDashboardPage onBack={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'live_chat' && (
          <LiveChatPage
            onBack={() => setCurrentScreen('dashboard')}
            onNavigateToQuickCode={() => setCurrentScreen('quickcode')}
            onNavigateToWithdraw={() => setCurrentScreen('withdraw')}
          />
        )}

        {currentScreen === 'upgrade_tier' && (
          <UpgradeTierPage onBack={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'referrals' && (
          <ReferralsPage onBack={() => setCurrentScreen('dashboard')} />
        )}

        {/* Primary Dashboard View (Tabs) */}
        {currentScreen === 'dashboard' && (
          <>
            {/* Top Header */}
            <Header
              onOpenSettings={() => setCurrentScreen('settings')}
              onOpenNotifications={() => setCurrentScreen('notifications')}
            />

            {/* Tab Switcher Content */}
            {activeTab === 'home' && (
              <main className="space-y-4 flex-1">
                {/* 1. Total Balance Card */}
                <BalanceCard />

                {/* 2. 4 Quick Circular Action Buttons (Earn, Deposit, Withdraw, Quick Code) */}
                <QuickActions onActionClick={handleQuickAction} />

                {/* 3. Account Details & Transaction History Side-by-Side Cards */}
                <AccountCards
                  onOpenAccountDetails={() => setCurrentScreen('account_details')}
                  onOpenTransactionHistory={() => {
                    setSelectedTxForPage(null);
                    setCurrentScreen('transaction_history');
                  }}
                />

                {/* 4. Tier Upgrade Limit Banner */}
                <CashbackBanner
                  onLearnMore={() => setCurrentScreen('upgrade_tier')}
                />

                {/* 5. Recent Transactions */}
                <RecentTransactions
                  onSeeAll={() => {
                    setSelectedTxForPage(null);
                    setCurrentScreen('transaction_history');
                  }}
                  onQuickDeposit={() => setCurrentScreen('deposit')}
                  onViewTransaction={handleOpenTransaction}
                />
              </main>
            )}

            {activeTab === 'cards' && <CardsTab />}

            {activeTab === 'payments' && (
              <PaymentsTab
                onQuickAction={(act) => {
                  if (act === 'deposit') setCurrentScreen('deposit');
                  else if (act === 'withdraw') setCurrentScreen('withdraw');
                  else if (act === 'admin') setCurrentScreen('admin');
                }}
                onOpenAdmin={() => setCurrentScreen('admin')}
              />
            )}

            {activeTab === 'support' && (
              <SupportTab onStartLiveChat={() => setCurrentScreen('live_chat')} />
            )}

            {activeTab === 'more' && (
              <MoreTab
                onOpenAccountDetails={() => setCurrentScreen('account_details')}
                onOpenSettings={() => setCurrentScreen('settings')}
                onOpenTerms={() => setCurrentScreen('terms')}
                onOpenUpgradeTier={() => setCurrentScreen('upgrade_tier')}
                onOpenReferrals={() => setCurrentScreen('referrals')}
              />
            )}

            {/* Bottom Navigation */}
            <BottomNav
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setCurrentScreen('dashboard');
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<'register' | 'login'>('register');

  if (!isAuthenticated) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  return <DashboardContent />;
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

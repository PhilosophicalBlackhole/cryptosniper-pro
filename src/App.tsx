import { HashRouter, Route, Routes } from 'react-router';
import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { UserDashboard } from './components/UserDashboard';
import Home from './pages/Home';

type AppState = 'landing' | 'demo' | 'authenticated';

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'premium';
  avatar?: string | null;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleGetStarted = () => {
    setAppState('demo');
  };

  const handleSignUp = () => {
    setAuthModalTab('signup');
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setAuthModalTab('login');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setAppState('authenticated');
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('landing');
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    if (appState === 'demo') {
      return <Home />;
    }

    if (appState === 'authenticated' && user) {
      return (
        <UserDashboard
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        >
          {currentPage === 'dashboard' && <Home />}
          {currentPage === 'history' && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white mb-4">Trade History</h2>
              <p className="text-slate-400">Your trading history will appear here</p>
            </div>
          )}
          {currentPage === 'tutorials' && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white mb-4">Tutorials</h2>
              <p className="text-slate-400">Educational content coming soon</p>
            </div>
          )}
          {currentPage === 'community' && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white mb-4">Community</h2>
              <p className="text-slate-400">Chat and forums coming soon</p>
            </div>
          )}
          {currentPage === 'billing' && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white mb-4">Billing & Plans</h2>
              <p className="text-slate-400">Subscription management coming soon</p>
            </div>
          )}
          {currentPage === 'settings' && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              <p className="text-slate-400">Account settings coming soon</p>
            </div>
          )}
        </UserDashboard>
      );
    }

    return (
      <LandingPage
        onGetStarted={handleGetStarted}
        onSignUp={handleSignUp}
        onLogin={handleLogin}
      />
    );
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={renderContent()} />
      </Routes>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
        onSuccess={handleAuthSuccess}
      />
    </HashRouter>
  );
}

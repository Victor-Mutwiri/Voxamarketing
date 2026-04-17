

import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './screens/LandingPage';
import ExplorePage from './screens/ExplorePage';
import AuthPage from './screens/AuthPage';
import BusinessOnboarding from './screens/BusinessOnboarding';
import BusinessDashboard from './screens/BusinessDashboard';
import BusinessProfileEditor from './screens/BusinessProfileEditor';
import BusinessSettings from './screens/BusinessSettings';
import BusinessInquiries from './screens/BusinessInquiries';
import AdminDashboard from './screens/AdminDashboard';
import { storage } from './utils/storage';
import { User } from './types';

/**
 * Protected Route Component
 * Ensures user is authenticated and has completed onboarding if accessing business routes.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode, requireOnboarding?: boolean }> = ({ 
  children, 
  requireOnboarding = true 
}) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await storage.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-voxa-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if profile is incomplete and it's not the onboarding page
  if (requireOnboarding && !user.isProfileComplete && location.pathname !== '/business/onboarding') {
    return <Navigate to="/business/onboarding" replace />;
  }

  // Redirect away from onboarding if profile IS complete
  if (user.isProfileComplete && location.pathname === '/business/onboarding') {
    return <Navigate to="/business/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Business Routes */}
        <Route path="/business/onboarding" element={
          <ProtectedRoute requireOnboarding={false}>
            <BusinessOnboarding />
          </ProtectedRoute>
        } />
        <Route path="/business/dashboard" element={
          <ProtectedRoute>
            <BusinessDashboard />
          </ProtectedRoute>
        } />
        <Route path="/business/profile" element={
          <ProtectedRoute>
            <BusinessProfileEditor />
          </ProtectedRoute>
        } />
        <Route path="/business/settings" element={
          <ProtectedRoute>
            <BusinessSettings />
          </ProtectedRoute>
        } />
        <Route path="/business/inquiries" element={
          <ProtectedRoute>
            <BusinessInquiries />
          </ProtectedRoute>
        } />
        
        {/* Hidden Admin Route */}
        <Route 
          path="/portal/8f030ac9-93da-41cc-af88-d9342cd54e5d" 
          element={<AdminDashboard />} 
        />

        {/* Fallback route redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
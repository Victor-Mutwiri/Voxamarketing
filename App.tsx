import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './screens/LandingPage';
import ExplorePage from './screens/ExplorePage';
import AuthPage from './screens/AuthPage';
import BusinessOnboarding from './screens/BusinessOnboarding';
import BusinessDashboard from './screens/BusinessDashboard';
import BusinessProfileEditor from './screens/BusinessProfileEditor';

/**
 * App Component
 * 
 * Uses HashRouter to handle routing within the application.
 * This ensures compatibility with environments that do not support
 * HTML5 History API (pushState) based routing for static file serving.
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/business/onboarding" element={<BusinessOnboarding />} />
        <Route path="/business/dashboard" element={<BusinessDashboard />} />
        <Route path="/business/profile" element={<BusinessProfileEditor />} />
        {/* Fallback route redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
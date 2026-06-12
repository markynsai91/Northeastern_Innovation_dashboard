import React from 'react';
import Dashboard from './components/Dashboard';
import ReviewerAdminPortal from './pages/ReviewerAdminPortal';
import SupabaseDashboard from './pages/SupabaseDashboard';
import TopNav from './components/TopNav';
import './App.css';

function App() {
  const currentPath = window.location.pathname;

  if (
    currentPath === '/reviewer' ||
    currentPath === '/admin' ||
    currentPath === '/reviewer-admin'
  ) {
    return (
      <div className="App">
        <TopNav />
        <ReviewerAdminPortal />
      </div>
    );
  }

  if (currentPath === '/supabase-dashboard') {
    return (
      <div className="App">
        <TopNav />
        <SupabaseDashboard />
      </div>
    );
  }

  return (
    <div className="App">
      <TopNav />
      <Dashboard />
    </div>
  );
}

export default App;
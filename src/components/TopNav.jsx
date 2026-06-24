import { useEffect, useState } from 'react';
import '../styles/Reviewer.css';

function TopNav() {
  const currentPath = window.location.pathname;

  const getReviewerAdminLoginStatus = () => {
    return (
      localStorage.getItem('innovation_dashboard_review_admin_login') === 'true'
    );
  };

  const [isReviewerAdminLoggedIn, setIsReviewerAdminLoggedIn] = useState(
    getReviewerAdminLoginStatus()
  );

  useEffect(() => {
    function updateLoginStatus() {
      setIsReviewerAdminLoggedIn(getReviewerAdminLoginStatus());
    }

    updateLoginStatus();

    window.addEventListener('reviewerAdminLoginChanged', updateLoginStatus);
    window.addEventListener('storage', updateLoginStatus);
    window.addEventListener('focus', updateLoginStatus);

    return () => {
      window.removeEventListener('reviewerAdminLoginChanged', updateLoginStatus);
      window.removeEventListener('storage', updateLoginStatus);
      window.removeEventListener('focus', updateLoginStatus);
    };
  }, []);

  function isActive(path) {
    if (path === '/' && currentPath === '/') return true;

    if (
      path === '/reviewer-admin' &&
      (currentPath === '/reviewer-admin' ||
        currentPath === '/reviewer' ||
        currentPath === '/admin')
    ) {
      return true;
    }

    if (path !== '/' && currentPath === path) return true;

    return false;
  }

  return (
    <nav className="top-nav">
      <div className="top-nav-brand">Innovation Dashboard</div>

      <div className="top-nav-links">
        <a
          className={isActive('/') ? 'top-nav-link active' : 'top-nav-link'}
          href="/"
        >
          Dashboard
        </a>

        {isReviewerAdminLoggedIn && (
          <a
            className={
              isActive('/supabase-dashboard')
                ? 'top-nav-link active'
                : 'top-nav-link'
            }
            href="/supabase-dashboard"
          >
            Supabase Dashboard
          </a>
        )}

        <a
          className={
            isActive('/reviewer-admin')
              ? 'top-nav-link active'
              : 'top-nav-link'
          }
          href="/reviewer-admin"
        >
          Review/Admin
        </a>
      </div>
    </nav>
  );
}

export default TopNav;
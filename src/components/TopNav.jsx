import '../styles/Reviewer.css';

function TopNav() {
  const currentPath = window.location.pathname;

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
        <a className={isActive('/') ? 'top-nav-link active' : 'top-nav-link'} href="/">
          Dashboard
        </a>

        <a
          className={
            isActive('/supabase-dashboard')
              ? 'top-nav-link active'
              : 'top-nav-link'
          }
          href="/supabase-dashboard"
        >
          Supabase Test
        </a>

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
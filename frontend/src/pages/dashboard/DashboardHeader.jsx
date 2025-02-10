export function DashboardHeader({ username }) {
    return (
      <header className="dashboard-header">
        <div className="header-content">
          <a href="/" className="logo-link">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-02%20at%209.42.58%20PM-1sisRn9PHxzjXgPZYqDBScmlvwyX7o.png"
              alt="NepNutri Logo"
              width={120}
              height={40}
            />
          </a>
  
          <div className="header-right">
            <span className="greeting">Welcome, {username}!</span>
            <nav className="header-nav">
              <a href="/messages" className="icon-link" title="Messages">
                <span className="icon icon-mail" aria-hidden="true"></span>
                <span className="sr-only">Messages</span>
              </a>
              <a href="/help" className="icon-link" title="Help">
                <span className="icon icon-help" aria-hidden="true"></span>
                <span className="sr-only">Help</span>
              </a>
              <a href="/settings" className="icon-link" title="Settings">
                <span className="icon icon-settings" aria-hidden="true"></span>
                <span className="sr-only">Settings</span>
              </a>
              <a href="/logout" className="logout-link">
                Log Out
              </a>
            </nav>
          </div>
        </div>
      </header>
    )
  }
  
  
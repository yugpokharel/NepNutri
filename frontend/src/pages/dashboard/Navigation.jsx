export function Navigation() {
    return (
      <nav className="main-nav">
        <div className="nav-container">
          <a href="/dashboard" className="nav-link active">
            <span className="icon icon-home" aria-hidden="true"></span>
            Dashboard
          </a>
          <a href="/food" className="nav-link">
            <span className="icon icon-food" aria-hidden="true"></span>
            Food Log
          </a>
          <a href="/exercises" className="nav-link">
            <span className="icon icon-exercise" aria-hidden="true"></span>
            Exercises
          </a>
          <a href="/progress" className="nav-link">
            <span className="icon icon-chart" aria-hidden="true"></span>
            Progress
          </a>
          <a href="/community" className="nav-link">
            <span className="icon icon-community" aria-hidden="true"></span>
            Community
          </a>
        </div>
      </nav>
    )
  }
  
  
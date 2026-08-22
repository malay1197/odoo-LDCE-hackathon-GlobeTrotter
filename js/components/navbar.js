// Top Header Navbar Component for GlobeTrotter
import { auth } from '../models/auth.js';

export function renderNavbar() {
  const currentUser = auth.getUser();
  const isAuthenticated = auth.isAuthenticated();
  const currentHash = window.location.hash || '#landing';

  return `
    <nav class="navbar">
      <div class="brand-logo" onclick="window.location.hash = '${isAuthenticated ? '#dashboard' : '#landing'}'">
        <div class="logo-icon">🧳</div>
        <div>Globe<span class="accent">Trotter</span></div>
      </div>

      <ul class="nav-links">
        ${isAuthenticated ? `
          <li><a class="nav-link ${currentHash === '#dashboard' ? 'active' : ''}" href="#dashboard">📊 Dashboard</a></li>
          <li><a class="nav-link ${currentHash === '#mytrips' ? 'active' : ''}" href="#mytrips">🗺️ My Trips</a></li>
          <li><a class="nav-link ${currentHash === '#destinations' ? 'active' : ''}" href="#destinations">📍 Destinations</a></li>
          <li><a class="nav-link ${currentHash === '#activities' ? 'active' : ''}" href="#activities">🎟️ Activities</a></li>
          <li><a class="nav-link ${currentHash === '#features' ? 'active' : ''}" href="#features">✨ Advanced Tools</a></li>
        ` : `
          <li><a class="nav-link ${currentHash === '#landing' ? 'active' : ''}" href="#landing">Home</a></li>
          <li><a class="nav-link ${currentHash === '#destinations' ? 'active' : ''}" href="#destinations">Explore Destinations</a></li>
        `}
      </ul>

      <div class="nav-actions">
        ${isAuthenticated ? `
          <button class="btn btn-ai btn-sm" onclick="window.location.hash = '#ai-planner'">
            ✨ AI Planner
          </button>
          <div class="user-menu-btn" onclick="window.location.hash = '#profile'" title="View Profile">
            <div class="avatar-img">${currentUser.avatar || 'U'}</div>
            <span style="font-weight:600; font-size:0.9rem;">${currentUser.name.split(' ')[0]}</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.GlobeTrotter.logout()">
            Logout
          </button>
        ` : `
          <button class="btn btn-secondary btn-sm" onclick="window.location.hash = '#login'">
            Log In
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.location.hash = '#signup'">
            Sign Up Free
          </button>
        `}
      </div>
    </nav>
  `;
}

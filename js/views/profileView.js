// User Profile & Settings View for GlobeTrotter
import { auth } from '../models/auth.js';
import { db } from '../db/database.js';
import { showToast } from '../components/toast.js';

export function renderProfileView() {
  const user = auth.getUser() || { name: 'Malay Rajput', email: 'malay@globetrotter.io', avatar: 'MR' };
  const preferences = db.where('user_preferences', p => p.user_id === user.id)[0] || {
    travel_style: 'Cultural & Heritage',
    language: 'English',
    favorite_interests: ['Historical Monuments', 'Local Food', 'Photography']
  };

  return `
    <div style="max-width: 850px; margin: 0 auto;">
      <div style="margin-bottom:2rem;">
        <span class="badge badge-coral">Account</span>
        <h1 style="font-size: 2.2rem; margin-top: 0.25rem;">User Profile & Settings</h1>
      </div>

      <!-- Profile Header Card -->
      <div class="card" style="display:flex; align-items:center; gap:1.5rem; margin-bottom:2rem; padding:2rem;">
        <div class="avatar-img" style="width:72px; height:72px; font-size:1.8rem;">${user.avatar || 'U'}</div>
        <div style="flex:1;">
          <h2 style="font-size:1.6rem; margin-bottom:0.2rem;">${user.name}</h2>
          <p style="color:var(--text-muted); font-size:0.95rem;">${user.email}</p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="window.GlobeTrotter.logout()">Logout</button>
      </div>

      <!-- Settings Form Card -->
      <div class="card" style="margin-bottom:2rem; padding:2rem;">
        <h3 style="margin-bottom:1.5rem;">Edit Profile Details</h3>
        <form onsubmit="window.GlobeTrotter.handleSaveProfile(event)">
          <div class="grid-2">
            <div class="form-group">
              <label for="prof-name">Full Name</label>
              <input type="text" id="prof-name" class="form-control" value="${user.name}" required>
            </div>
            <div class="form-group">
              <label for="prof-email">Email Address</label>
              <input type="email" id="prof-email" class="form-control" value="${user.email}" disabled readonly>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label for="prof-language">Preferred Language</label>
              <select id="prof-language" class="form-control">
                <option value="English" ${preferences.language === 'English' ? 'selected' : ''}>English</option>
                <option value="Hindi" ${preferences.language === 'Hindi' ? 'selected' : ''}>Hindi (हिंदी)</option>
                <option value="Gujarati" ${preferences.language === 'Gujarati' ? 'selected' : ''}>Gujarati (ગુજરાતી)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="prof-style">Default Travel Style</label>
              <select id="prof-style" class="form-control">
                <option value="Cultural & Heritage" ${preferences.travel_style === 'Cultural & Heritage' ? 'selected' : ''}>Cultural & Heritage</option>
                <option value="Backpacker & Budget" ${preferences.travel_style === 'Backpacker & Budget' ? 'selected' : ''}>Backpacker & Budget</option>
                <option value="Luxury & Relaxation" ${preferences.travel_style === 'Luxury & Relaxation' ? 'selected' : ''}>Luxury & Relaxation</option>
                <option value="Adventure & Nature" ${preferences.travel_style === 'Adventure & Nature' ? 'selected' : ''}>Adventure & Nature</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top:1rem;">Save Profile Settings</button>
        </form>
      </div>

      <!-- Privacy & Data Controls -->
      <div class="card" style="margin-bottom:2rem; padding:2rem;">
        <h3 style="margin-bottom:1rem;">Privacy & Database Management</h3>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">
          Export your complete relational database as JSON or import backup data.
        </p>

        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="window.GlobeTrotter.exportDatabaseJSON()">📥 Export Data (JSON)</button>
          <button class="btn btn-secondary" onclick="window.GlobeTrotter.importDatabaseJSON()">📤 Import Data (JSON)</button>
          <button class="btn btn-secondary" style="color:#DC2626;" onclick="window.GlobeTrotter.confirmDeleteAccount()">⚠️ Delete Account</button>
        </div>
      </div>
    </div>
  `;
}

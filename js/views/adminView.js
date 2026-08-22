// Admin & System Analytics Dashboard View
import { db } from '../db/database.js';

export function renderAdminView() {
  const users = db.getAll('users');
  const trips = db.getAll('trips');
  const cities = db.getAll('cities');
  const activities = db.getAll('activities');

  return `
    <div>
      <div style="margin-bottom:2rem;">
        <span class="badge badge-purple">Admin Panel</span>
        <h1 style="font-size: 2.2rem; margin-top: 0.25rem;">Platform Analytics & Administration</h1>
      </div>

      <!-- Stat Cards -->
      <div class="grid-4" style="margin-bottom: 2rem;">
        <div class="card">
          <span style="color:var(--text-muted); font-size:0.85rem; font-weight:600;">Registered Users</span>
          <div style="font-size:2rem; font-weight:800; color:var(--primary-coral); margin-top:0.25rem;">${users.length}</div>
        </div>
        <div class="card">
          <span style="color:var(--text-muted); font-size:0.85rem; font-weight:600;">Total Trips Created</span>
          <div style="font-size:2rem; font-weight:800; color:var(--peacock-blue); margin-top:0.25rem;">${trips.length}</div>
        </div>
        <div class="card">
          <span style="color:var(--text-muted); font-size:0.85rem; font-weight:600;">Indexed Destinations</span>
          <div style="font-size:2rem; font-weight:800; color:var(--indian-green); margin-top:0.25rem;">${cities.length}</div>
        </div>
        <div class="card">
          <span style="color:var(--text-muted); font-size:0.85rem; font-weight:600;">Indexed Activities</span>
          <div style="font-size:2rem; font-weight:800; color:var(--ai-purple); margin-top:0.25rem;">${activities.length}</div>
        </div>
      </div>

      <!-- Registered Users Table -->
      <div class="card" style="margin-bottom: 2rem;">
        <h3 style="margin-bottom:1rem;">User Directory</h3>
        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem;">
          <thead>
            <tr style="border-bottom:2px solid var(--border-warm); color:var(--text-muted);">
              <th style="padding:0.75rem;">Name</th>
              <th style="padding:0.75rem;">Email</th>
              <th style="padding:0.75rem;">Registered On</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr style="border-bottom:1px solid var(--border-light);">
                <td style="padding:0.75rem; font-weight:600;">${u.name}</td>
                <td style="padding:0.75rem; color:var(--text-muted);">${u.email}</td>
                <td style="padding:0.75rem;">${u.created_at ? u.created_at.split('T')[0] : '2026-01-15'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

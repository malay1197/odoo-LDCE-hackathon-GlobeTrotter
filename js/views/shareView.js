// Public Shared Itinerary View & Copy Trip Engine
import { db } from '../db/database.js';
import { auth } from '../models/auth.js';
import { formatINR, formatDateRange } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';

export function renderShareView(tripId) {
  const trip = db.getTripFullDetails(tripId);
  if (!trip) {
    return `<div class="card" style="text-align:center; padding:3rem;"><h2>Shared Trip Not Found</h2></div>`;
  }

  const currentUser = auth.getUser();

  return `
    <div style="max-width: 960px; margin: 0 auto;">
      <!-- Shared Banner Top Header -->
      <div class="card" style="background: linear-gradient(135deg, #007791, #004D40); color:white; padding:2rem; margin-bottom:2rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <span class="badge badge-gold" style="margin-bottom:0.5rem;">Public Shared Itinerary</span>
            <h1 style="font-size:2.2rem; color:white;">${trip.name}</h1>
            <p style="opacity:0.9; font-size:1rem; margin-top:0.25rem;">
              📅 ${formatDateRange(trip.start_date, trip.end_date)} • ${trip.total_days} Days • Total Est: ${formatINR(trip.cost_breakdown.total)}
            </p>
          </div>

          <div style="display:flex; gap:0.75rem;">
            <button class="btn btn-primary btn-lg" onclick="window.GlobeTrotter.copySharedTrip('${trip.id}')">
              📋 Copy Trip to My Account
            </button>
          </div>
        </div>
      </div>

      <!-- Read-Only Itinerary Details -->
      <div class="card" style="margin-bottom:2rem;">
        <h3 style="margin-bottom:1rem;">Trip Summary</h3>
        <p style="color:var(--text-main); font-size:1rem; margin-bottom:1.5rem;">${trip.description || 'No description provided.'}</p>

        <h4 style="margin-bottom:1rem; color:var(--primary-coral);">City Destinations (${trip.stops ? trip.stops.length : 0})</h4>
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          ${trip.stops ? trip.stops.map((stop, idx) => `
            <div style="border:1px solid var(--border-warm); border-radius:var(--radius-md); padding:1.25rem; background:var(--bg-warm-subtle);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <h4 style="font-size:1.2rem;">${idx + 1}. ${stop.city_details ? stop.city_details.name : ''} (${stop.city_details ? stop.city_details.state : ''})</h4>
                <span class="badge badge-coral">${stop.activities ? stop.activities.length : 0} Activities</span>
              </div>
              
              ${stop.activities && stop.activities.length > 0 ? `
                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                  ${stop.activities.map(act => `
                    <div style="background:white; padding:0.65rem 0.85rem; border-radius:var(--radius-sm); font-size:0.9rem; display:flex; justify-content:space-between;">
                      <span>⏰ <strong>${act.start_time || '10:00 AM'}</strong>: ${act.activity_details ? act.activity_details.title : ''}</span>
                      <strong style="color:var(--primary-coral);">${formatINR(act.cost)}</strong>
                    </div>
                  `).join('')}
                </div>
              ` : '<p style="font-size:0.85rem; color:var(--text-muted);">No assigned activities.</p>'}
            </div>
          `).join('') : '<p>No stops found.</p>'}
        </div>
      </div>

      <!-- Social Share Widget -->
      <div class="card" style="text-align:center; padding:2rem;">
        <h3 style="margin-bottom:0.75rem;">Share This Itinerary</h3>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.25rem;">Send this link to friends or share on social media</p>
        <div style="display:flex; justify-content:center; gap:0.85rem; flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="window.GlobeTrotter.copyCurrentLink()">🔗 Copy Share Link</button>
          <button class="btn btn-secondary" style="background:#25D366; color:white; border:none;" onclick="window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(window.location.href), '_blank')">📱 WhatsApp</button>
          <button class="btn btn-secondary" style="background:#1DA1F2; color:white; border:none;" onclick="window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent('Check out my India trip itinerary on GlobeTrotter! ' + window.location.href), '_blank')">🐦 Twitter</button>
        </div>
      </div>
    </div>
  `;
}

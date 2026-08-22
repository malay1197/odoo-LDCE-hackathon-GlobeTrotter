// Dedicated Calendar & Timeline View for GlobeTrotter
import { db } from '../db/database.js';
import { formatDateRange, formatINR } from '../utils/formatters.js';

export function renderCalendarView(tripId) {
  const trip = db.getTripFullDetails(tripId);
  if (!trip) {
    return `<div class="card" style="text-align:center; padding:3rem;"><h2>Trip Not Found</h2></div>`;
  }

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <a href="#mytrips" style="font-size:0.9rem; font-weight:600;">← My Trips</a>
            <span style="color:var(--text-light);">/</span>
            <span class="badge badge-coral">Interactive Calendar</span>
          </div>
          <h1 style="font-size: 2.2rem; margin-top: 0.25rem;">Trip Schedule & Calendar</h1>
          <p style="color:var(--text-muted); font-size:0.95rem;">
            ${trip.name} • 📅 ${formatDateRange(trip.start_date, trip.end_date)} (${trip.total_days} Days)
          </p>
        </div>

        <div style="display:flex; gap:0.75rem;">
          <button class="btn btn-primary" onclick="window.location.hash = '#builder/${trip.id}'">✏️ Edit Builder</button>
        </div>
      </div>

      <div class="card" style="padding:2rem;">
        <h3 style="margin-bottom:1.5rem;">Day-by-Day Activity Schedule</h3>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${trip.stops ? trip.stops.map(stop => `
            <div style="background:var(--bg-warm-subtle); border-radius:var(--radius-md); padding:1.25rem; border:1px solid var(--border-warm);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <h4 style="font-size:1.15rem; color:var(--peacock-blue);">📍 ${stop.city_details ? stop.city_details.name : 'Destination'}</h4>
                <span class="badge badge-coral">${stop.activities ? stop.activities.length : 0} Events</span>
              </div>

              ${stop.activities && stop.activities.length > 0 ? `
                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                  ${stop.activities.map(act => `
                    <div style="background:white; padding:0.75rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--border-light); display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <strong>Day ${act.day_number || 1} • ${act.start_time || '10:00 AM'}</strong> — ${act.activity_details ? act.activity_details.title : 'Activity'}
                      </div>
                      <span style="font-weight:700; color:var(--primary-coral);">${formatINR(act.cost)}</span>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <p style="font-size:0.85rem; color:var(--text-muted); font-style:italic;">No activities assigned yet.</p>
              `}
            </div>
          `).join('') : '<p style="color:var(--text-muted);">No stops added.</p>'}
        </div>
      </div>
    </div>
  `;
}

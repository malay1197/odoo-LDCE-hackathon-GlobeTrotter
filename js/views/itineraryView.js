// Itinerary Visualization View (Day-wise Layout with View Toggle & PDF Voucher Export)
import { db } from '../db/database.js';
import { formatINR, formatDateRange } from '../utils/formatters.js';

export function renderItineraryView(tripId, viewMode = 'list') {
  const trip = db.getTripFullDetails(tripId);
  if (!trip) {
    return `<div class="card" style="text-align:center; padding:3rem;"><h2>Trip Not Found</h2></div>`;
  }

  // Aggregate all activities grouped by day number
  const daysMap = {};
  for (let d = 1; d <= trip.total_days; d++) {
    daysMap[d] = [];
  }

  if (trip.stops) {
    trip.stops.forEach(stop => {
      stop.activities.forEach(act => {
        const day = act.day_number || 1;
        if (!daysMap[day]) daysMap[day] = [];
        daysMap[day].push({
          ...act,
          cityName: stop.city_details ? stop.city_details.name : ''
        });
      });
    });
  }

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <a href="#mytrips" style="font-size:0.9rem; font-weight:600;">← My Trips</a>
            <span style="color:var(--text-light);">/</span>
            <span class="badge badge-coral">Itinerary Visualization</span>
          </div>
          <h1 style="font-size: 2.2rem; margin-top: 0.25rem;">${trip.name}</h1>
          <p style="color:var(--text-muted); font-size:0.95rem;">
            📅 ${formatDateRange(trip.start_date, trip.end_date)} • ${trip.total_days} Days Journey
          </p>
        </div>

        <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
          <div class="tabs" style="margin-bottom:0;">
            <button class="tab-btn ${viewMode === 'list' ? 'active' : ''}" onclick="window.GlobeTrotter.switchItineraryMode('${trip.id}', 'list')">📋 List View</button>
            <button class="tab-btn ${viewMode === 'timeline' ? 'active' : ''}" onclick="window.GlobeTrotter.switchItineraryMode('${trip.id}', 'timeline')">⏱️ Timeline</button>
            <button class="tab-btn ${viewMode === 'calendar' ? 'active' : ''}" onclick="window.GlobeTrotter.switchItineraryMode('${trip.id}', 'calendar')">📅 Calendar</button>
          </div>
          <button class="btn btn-primary" onclick="window.location.hash = '#builder/${trip.id}'">✏️ Edit Builder</button>
          <button class="btn btn-secondary" onclick="window.print()">🖨️ Print / Save PDF</button>
          <button class="btn btn-outline" onclick="window.GlobeTrotter.shareTrip('${trip.id}')">🔗 Share</button>
        </div>
      </div>

      <!-- Mode Content Render -->
      ${viewMode === 'list' ? `
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          ${Object.keys(daysMap).map(dayNum => `
            <div class="card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-light); padding-bottom:0.75rem;">
                <h3 style="font-size:1.3rem; color:var(--primary-coral);">Day ${dayNum} Schedule</h3>
                <span class="badge badge-blue">${daysMap[dayNum].length} Activities</span>
              </div>

              ${daysMap[dayNum].length > 0 ? `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                  ${daysMap[dayNum].map(act => `
                    <div style="display:flex; gap:1.25rem; background:white; border:1px solid var(--border-warm); padding:1rem; border-radius:var(--radius-md); box-shadow:var(--shadow-sm); align-items:center;">
                      <img src="${act.activity_details ? act.activity_details.image : ''}" style="width:90px; height:70px; object-fit:cover; border-radius:var(--radius-sm);" alt="">
                      <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:0.5rem;">
                          <span class="badge badge-gold" style="font-size:0.7rem;">${act.cityName}</span>
                          <span style="font-size:0.85rem; font-weight:600; color:var(--peacock-blue);">⏰ ${act.start_time || '10:00 AM'}</span>
                        </div>
                        <h4 style="font-size:1.1rem; margin:0.25rem 0;">${act.activity_details ? act.activity_details.title : 'Activity'}</h4>
                        <p style="font-size:0.85rem; color:var(--text-muted);">${act.activity_details ? act.activity_details.description : ''}</p>
                      </div>
                      <div style="text-align:right;">
                        <div style="font-weight:800; font-size:1.1rem; color:var(--primary-coral);">${formatINR(act.cost)}</div>
                        <span style="font-size:0.8rem; color:var(--text-muted);">${act.activity_details ? act.activity_details.duration + ' hrs' : ''}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <p style="color:var(--text-muted); font-size:0.9rem; font-style:italic;">No activities scheduled for Day ${dayNum}. Add activities from the builder.</p>
              `}
            </div>
          `).join('')}
        </div>
      ` : viewMode === 'timeline' ? `
        <div class="card" style="padding:2rem;">
          <h3 style="margin-bottom:1.5rem;">Trip Timeline View</h3>
          <div style="border-left: 3px solid var(--primary-coral); padding-left:1.5rem; display:flex; flex-direction:column; gap:2rem;">
            ${Object.keys(daysMap).map(dayNum => `
              <div style="position:relative;">
                <div style="position:absolute; left:-31px; top:0; background:var(--primary-coral); color:white; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700;">${dayNum}</div>
                <h4 style="font-size:1.2rem; margin-bottom:0.75rem;">Day ${dayNum}</h4>
                ${daysMap[dayNum].map(act => `
                  <div style="background:var(--bg-warm-subtle); padding:0.85rem 1rem; border-radius:var(--radius-md); margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong>${act.start_time || '10:00 AM'}</strong> — ${act.activity_details ? act.activity_details.title : ''} (${act.cityName})
                    </div>
                    <span style="font-weight:700; color:var(--primary-coral);">${formatINR(act.cost)}</span>
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      ` : `
        <!-- Calendar View -->
        <div class="card" style="padding:2rem;">
          <h3 style="margin-bottom:1.5rem;">Calendar Grid View</h3>
          <div class="grid-4">
            ${Object.keys(daysMap).map(dayNum => `
              <div style="border:1px solid var(--border-warm); border-radius:var(--radius-md); padding:1rem; background:white; min-height:160px;">
                <div style="font-weight:800; color:var(--primary-coral); margin-bottom:0.5rem; font-size:1.1rem;">Day ${dayNum}</div>
                ${daysMap[dayNum].map(act => `
                  <div style="background:var(--primary-saffron-light); padding:0.4rem 0.6rem; border-radius:var(--radius-sm); font-size:0.8rem; margin-bottom:0.4rem; border-left:3px solid var(--primary-coral);">
                    <strong>${act.start_time || '10:00 AM'}</strong>: ${act.activity_details ? act.activity_details.title : ''}
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        `}
    </div>
  `;
}

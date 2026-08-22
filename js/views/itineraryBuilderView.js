// Interactive Itinerary Builder View for GlobeTrotter
import { db } from '../db/database.js';
import { formatINR, formatDateRange } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';

export function renderItineraryBuilderView(tripId) {
  const trip = db.getTripFullDetails(tripId);
  if (!trip) {
    return `<div class="card" style="text-align:center; padding:3rem;"><h2>Trip Not Found</h2><a href="#mytrips" class="btn btn-primary" style="margin-top:1rem;">Back to My Trips</a></div>`;
  }

  const cities = db.getAll('cities');

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <a href="#mytrips" style="font-size:0.9rem; font-weight:600;">← My Trips</a>
            <span style="color:var(--text-light);">/</span>
            <span class="badge badge-coral">Itinerary Builder</span>
          </div>
          <h1 style="font-size: 2rem; margin-top: 0.25rem;">${trip.name}</h1>
          <p style="color:var(--text-muted); font-size:0.9rem;">
            📅 ${formatDateRange(trip.start_date, trip.end_date)} • ${trip.total_days} Days • Total Est: <strong style="color:var(--primary-coral);">${formatINR(trip.cost_breakdown.total)}</strong>
          </p>
        </div>

        <div style="display:flex; gap:0.75rem;">
          <button class="btn btn-primary" onclick="window.GlobeTrotter.openAddStopModal('${trip.id}')">
            ➕ Add City Stop
          </button>
          <button class="btn btn-secondary" onclick="window.location.hash = '#itinerary/${trip.id}'">
            👁️ Preview Itinerary
          </button>
          <button class="btn btn-outline" onclick="window.location.hash = '#budget/${trip.id}'">
            💰 Budget breakdown
          </button>
        </div>
      </div>

      <!-- City Stops List -->
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        ${trip.stops && trip.stops.length > 0 ? trip.stops.map((stop, idx) => `
          <div class="card" style="padding:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-light); padding-bottom:0.75rem;">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <span class="badge badge-coral" style="font-size:0.9rem; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; padding:0;">${idx + 1}</span>
                <h3 style="font-size:1.35rem;">${stop.city_details ? stop.city_details.name : 'Unknown City'}</h3>
                <span style="font-size:0.85rem; color:var(--text-muted); font-weight:500;">
                  (📅 ${stop.arrival_date ? formatDateRange(stop.arrival_date, stop.departure_date) : 'Dates unset'})
                </span>
              </div>

              <div style="display:flex; gap:0.5rem;">
                ${idx > 0 ? `<button class="btn btn-secondary btn-sm" onclick="window.GlobeTrotter.reorderStop('${trip.id}', '${stop.id}', 'up')" title="Move Up">▲ Move Up</button>` : ''}
                ${idx < trip.stops.length - 1 ? `<button class="btn btn-secondary btn-sm" onclick="window.GlobeTrotter.reorderStop('${trip.id}', '${stop.id}', 'down')" title="Move Down">▼ Move Down</button>` : ''}
                <button class="btn btn-outline btn-sm" onclick="window.GlobeTrotter.openAddActivityModal('${stop.id}', '${stop.city_id}')">➕ Add Activity</button>
                <button class="btn btn-secondary btn-sm" style="color:#DC2626;" onclick="window.GlobeTrotter.removeStop('${trip.id}', '${stop.id}')">🗑️ Remove Stop</button>
              </div>
            </div>

            <!-- Stop Activities List -->
            <div>
              <h4 style="font-size:0.95rem; color:var(--text-muted); margin-bottom:0.75rem;">Assigned Activities:</h4>
              ${stop.activities && stop.activities.length > 0 ? `
                <div class="grid-2">
                  ${stop.activities.map(act => `
                    <div style="display:flex; gap:1rem; background:var(--bg-warm-subtle); padding:0.85rem; border-radius:var(--radius-md); border:1px solid var(--border-warm); align-items:center;">
                      <img src="${act.activity_details ? act.activity_details.image : ''}" style="width:64px; height:64px; object-fit:cover; border-radius:var(--radius-sm);" alt="">
                      <div style="flex:1;">
                        <div style="font-weight:700; font-size:0.95rem;">${act.activity_details ? act.activity_details.title : 'Activity'}</div>
                        <div style="font-size:0.8rem; color:var(--text-muted);">
                          Day ${act.day_number || 1} • ${act.start_time || '10:00 AM'} • <strong style="color:var(--primary-coral);">${formatINR(act.cost)}</strong>
                        </div>
                      </div>
                      <button class="btn btn-secondary btn-sm" style="color:#DC2626; padding:0.3rem 0.5rem;" onclick="window.GlobeTrotter.removeTripActivity('${trip.id}', '${act.id}')">✕</button>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <p style="color:var(--text-muted); font-size:0.88rem; font-style:italic;">No activities assigned to this stop yet. Click "Add Activity" to discover experiences.</p>
              `}
            </div>
          </div>
        `).join('') : `
          <div class="card" style="text-align:center; padding:3rem; color:var(--text-muted);">
            <h3>No city stops added yet.</h3>
            <p style="margin-bottom:1rem;">Add your first city stop to build your itinerary.</p>
            <button class="btn btn-primary" onclick="window.GlobeTrotter.openAddStopModal('${trip.id}')">➕ Add City Stop</button>
          </div>
        `}
      </div>
    </div>

    <!-- Add Stop Modal -->
    <div id="add-stop-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Add Destination Stop</h3>
          <button class="modal-close" onclick="window.GlobeTrotter.closeModal('add-stop-modal')">✕</button>
        </div>
        <form onsubmit="window.GlobeTrotter.handleAddStopSubmit(event, '${trip.id}')">
          <div class="form-group">
            <label for="stop-city-id">Select City *</label>
            <select id="stop-city-id" class="form-control" required>
              ${cities.map(c => `<option value="${c.id}">${c.name} (${c.state}) - ${c.cost_index}</option>`).join('')}
            </select>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label for="stop-arrival-date">Arrival Date</label>
              <input type="date" id="stop-arrival-date" class="form-control" value="${trip.start_date}">
            </div>
            <div class="form-group">
              <label for="stop-departure-date">Departure Date</label>
              <input type="date" id="stop-departure-date" class="form-control" value="${trip.end_date}">
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; margin-top:1rem;">Save Stop</button>
        </form>
      </div>
    </div>
  `;
}

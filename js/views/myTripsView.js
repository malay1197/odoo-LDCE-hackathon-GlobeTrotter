// My Trips Library View for GlobeTrotter
import { auth } from '../models/auth.js';
import { db } from '../db/database.js';
import { formatINR, formatDateRange } from '../utils/formatters.js';

export function renderMyTripsView(filterStatus = 'All', searchQuery = '') {
  const user = auth.getUser() || { id: 'usr-malay-1', name: 'Malay Rajput' };
  const userId = user.id || 'usr-malay-1';

  let trips = db.where('trips', t => t.user_id === userId || !t.user_id);
  if (trips.length === 0) {
    trips = db.getAll('trips');
  }

  if (filterStatus !== 'All') {
    trips = trips.filter(t => t.status === filterStatus);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    trips = trips.filter(t => t.name.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
  }

  const fullTrips = trips.map(t => db.getTripFullDetails(t.id));

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
        <div>
          <span class="badge badge-coral">Library</span>
          <h1 style="font-size: 2.2rem; margin-top: 0.25rem;">My Trip Itineraries</h1>
        </div>
        <button class="btn btn-primary" onclick="window.GlobeTrotter.openCreateTripModal()">
          ➕ Create New Trip
        </button>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="card" style="margin-bottom: 2rem; padding: 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; gap:0.5rem;">
            <button class="tab-btn ${filterStatus === 'All' ? 'active' : ''}" onclick="window.GlobeTrotter.filterTrips('All')">All Trips (${fullTrips.length})</button>
            <button class="tab-btn ${filterStatus === 'Upcoming' ? 'active' : ''}" onclick="window.GlobeTrotter.filterTrips('Upcoming')">Upcoming</button>
            <button class="tab-btn ${filterStatus === 'Completed' ? 'active' : ''}" onclick="window.GlobeTrotter.filterTrips('Completed')">Completed</button>
          </div>

          <div style="min-width:280px;">
            <input type="text" class="form-control" placeholder="🔍 Search trips by name..." value="${searchQuery}" onkeyup="window.GlobeTrotter.searchTrips(this.value)">
          </div>
        </div>
      </div>

      <!-- Trip Cards Grid -->
      ${fullTrips.length > 0 ? `
        <div class="grid-3">
          ${fullTrips.map(trip => `
            <div class="card" style="display:flex; flex-direction:column; padding:0; overflow:hidden;">
              <div style="position:relative;">
                <img src="${trip.cover_photo || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'}" style="width:100%; height:160px; object-fit:cover;" alt="${trip.name}">
                <span class="badge badge-coral" style="position:absolute; top:12px; right:12px;">${trip.stops ? trip.stops.length : 0} Destinations</span>
              </div>

              <div style="padding:1.25rem; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <h3 style="font-size:1.25rem; margin-bottom:0.4rem;">${trip.name}</h3>
                  <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.75rem;">
                    📅 ${formatDateRange(trip.start_date, trip.end_date)} (${trip.total_days} Days)
                  </p>
                  <p style="font-size:0.88rem; color:var(--text-main); margin-bottom:1rem;">
                    ${trip.description ? (trip.description.length > 90 ? trip.description.substring(0, 90) + '...' : trip.description) : 'No description'}
                  </p>
                </div>

                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; padding:0.6rem 0; border-top:1px solid var(--border-light); margin-bottom:1rem;">
                    <span>Estimated Cost:</span>
                    <span style="color:var(--primary-coral);">${formatINR(trip.cost_breakdown.total)}</span>
                  </div>

                  <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                    <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.location.hash = '#itinerary/${trip.id}'">👁️ View</button>
                    <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.location.hash = '#builder/${trip.id}'">✏️ Edit</button>
                    <button class="btn btn-outline btn-sm" onclick="window.GlobeTrotter.duplicateTrip('${trip.id}')" title="Duplicate Trip">📋</button>
                    <button class="btn btn-outline btn-sm" onclick="window.GlobeTrotter.shareTrip('${trip.id}')" title="Share Link">🔗</button>
                    <button class="btn btn-secondary btn-sm" style="color:#DC2626;" onclick="window.GlobeTrotter.deleteTrip('${trip.id}')" title="Delete Trip">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="card" style="text-align:center; padding:4rem 2rem; color:var(--text-muted);">
          <div style="font-size:3.5rem; margin-bottom:0.75rem;">🗺️</div>
          <h3>No trips match your search or filter.</h3>
          <p style="margin-bottom:1.5rem;">Start by creating a new travel itinerary!</p>
          <button class="btn btn-primary" onclick="window.GlobeTrotter.openCreateTripModal()">Create Trip</button>
        </div>
      `}
    </div>
  `;
}

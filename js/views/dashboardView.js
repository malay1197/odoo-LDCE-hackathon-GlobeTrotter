// Dashboard Travel Command Center View for GlobeTrotter
import { auth } from '../models/auth.js';
import { db } from '../db/database.js';
import { formatINR, formatDateRange } from '../utils/formatters.js';

export function renderDashboardView() {
  const user = auth.getUser() || { name: 'Malay' };
  const userTrips = db.where('trips', t => t.user_id === user.id);
  const cities = db.getAll('cities').slice(0, 3);

  const upcomingTrips = userTrips.filter(t => t.status === 'Upcoming');
  const featuredTrip = upcomingTrips.length > 0 ? db.getTripFullDetails(upcomingTrips[0].id) : (userTrips.length > 0 ? db.getTripFullDetails(userTrips[0].id) : null);

  return `
    <div style="margin-bottom: 2rem;">
      <!-- Welcome Banner -->
      <div class="card" style="background: linear-gradient(135deg, #FFF3E0, #FFE0B2); border-color: #FFE082; padding: 2rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge badge-coral" style="margin-bottom: 0.5rem;">Travel Command Center</span>
            <h1 style="font-size: 2.2rem;">Good morning, ${user.name.split(' ')[0]} 👋</h1>
            <p style="color: var(--text-muted); font-size: 1.05rem;">Where are you going next?</p>
          </div>
          <div style="display: flex; gap: 0.85rem;">
            <button class="btn btn-primary btn-lg" onclick="window.GlobeTrotter.openCreateTripModal()">
              ➕ Plan New Trip
            </button>
            <button class="btn btn-ai btn-lg" onclick="window.location.hash = '#ai-planner'">
              ✨ AI Generator
            </button>
          </div>
        </div>

        <!-- Quick Destination Search -->
        <div style="margin-top: 1.5rem; position: relative;">
          <input type="text" id="dash-quick-search" class="form-control" placeholder="🔍 Search any city in India (e.g. Udaipur, Goa, Kutch)..." style="padding-left: 1.25rem; height: 50px; font-size: 1rem; box-shadow: var(--shadow-sm);" onkeyup="window.GlobeTrotter.handleDashboardSearch(event)">
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="grid-3" style="margin-bottom: 2rem;">
        <!-- Upcoming Trip Highlight Card -->
        <div class="card" style="grid-column: span 2; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3>🎯 Featured Journey</h3>
            ${featuredTrip ? `<a href="#itinerary/${featuredTrip.id}" style="font-weight:600; font-size:0.9rem;">View Full Itinerary →</a>` : ''}
          </div>

          ${featuredTrip ? `
            <div style="display:flex; gap:1.5rem; flex-wrap:wrap; flex:1;">
              <img src="${featuredTrip.cover_photo || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'}" style="width:240px; height:160px; object-fit:cover; border-radius:var(--radius-md);" alt="${featuredTrip.name}">
              <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <span class="badge badge-green">${featuredTrip.status}</span>
                  <h4 style="font-size:1.3rem; margin:0.4rem 0;">${featuredTrip.name}</h4>
                  <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:0.75rem;">
                    📅 ${formatDateRange(featuredTrip.start_date, featuredTrip.end_date)} • ${featuredTrip.total_days} Days
                  </p>
                  <p style="font-size:0.9rem; color:var(--text-main); margin-bottom:1rem;">
                    ${featuredTrip.description || 'Custom multi-city journey'}
                  </p>
                </div>
                <div style="display:flex; gap:0.75rem;">
                  <button class="btn btn-primary btn-sm" onclick="window.location.hash = '#builder/${featuredTrip.id}'">✏️ Edit Stops</button>
                  <button class="btn btn-secondary btn-sm" onclick="window.location.hash = '#budget/${featuredTrip.id}'">💰 Budget (${formatINR(featuredTrip.cost_breakdown.total)})</button>
                  <button class="btn btn-outline btn-sm" onclick="window.GlobeTrotter.shareTrip('${featuredTrip.id}')">🔗 Share</button>
                </div>
              </div>
            </div>
          ` : `
            <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
              <div style="font-size:3rem; margin-bottom:0.5rem;">✈️</div>
              <h4>No trips planned yet!</h4>
              <p style="font-size:0.9rem; margin-bottom:1rem;">Create your first personalized multi-city itinerary now.</p>
              <button class="btn btn-primary" onclick="window.GlobeTrotter.openCreateTripModal()">Plan New Trip</button>
            </div>
          `}
        </div>

        <!-- Budget & Stats Quick Highlight -->
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <h3>💰 Budget Overview</h3>

          ${featuredTrip ? `
            <div style="margin: 1rem 0;">
              <div style="display:flex; justify-content:space-between; font-size:0.9rem; font-weight:600; margin-bottom:0.4rem;">
                <span>Total Estimated</span>
                <span style="color:var(--primary-coral);">${formatINR(featuredTrip.cost_breakdown.total)}</span>
              </div>
              <div class="budget-progress-bar">
                <div class="budget-progress-fill" style="width: ${Math.min(100, Math.round((featuredTrip.cost_breakdown.total / (featuredTrip.total_budget || 50000)) * 100))}%;"></div>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted);">
                <span>Target: ${formatINR(featuredTrip.total_budget || 50000)}</span>
                <span>Daily Avg: ${formatINR(featuredTrip.cost_breakdown.daily_average)}/day</span>
              </div>
            </div>

            <div style="background:var(--bg-warm-subtle); padding:1rem; border-radius:var(--radius-md); font-size:0.85rem;">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
                <span>🚗 Transport:</span> <strong>${formatINR(featuredTrip.cost_breakdown.transport)}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
                <span>🏨 Stay:</span> <strong>${formatINR(featuredTrip.cost_breakdown.stay)}</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>🎟️ Activities:</span> <strong>${formatINR(featuredTrip.cost_breakdown.activities)}</strong>
              </div>
            </div>

            <button class="btn btn-secondary btn-sm" style="margin-top:1rem; width:100%;" onclick="window.location.hash = '#budget/${featuredTrip.id}'">
              View Detailed Budget →
            </button>
          ` : `
            <p style="color:var(--text-muted); font-size:0.9rem;">Select or create a trip to see real-time cost breakdown.</p>
          `}
        </div>
      </div>

      <!-- Recommended Destinations Row -->
      <div style="margin-bottom: 2rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h3>📍 Recommended Destinations For You</h3>
          <a href="#destinations" style="font-weight:600; font-size:0.9rem;">View All Cities →</a>
        </div>

        <div class="grid-3">
          ${cities.map(city => `
            <div class="city-card">
              <img src="${city.image}" class="city-card-img" alt="${city.name}">
              <div class="city-card-body">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <h4>${city.name}</h4>
                  <span class="badge badge-coral">${city.cost_index}</span>
                </div>
                <p style="font-size:0.85rem; color:var(--text-muted); margin:0.3rem 0 0.8rem;">${city.state}, India</p>
                <div class="city-meta">
                  <span style="font-size:0.8rem; font-weight:600;">⏱️ ${city.recommended_duration}</span>
                  <button class="btn btn-outline btn-sm" onclick="window.GlobeTrotter.addCityToTripModal('${city.id}')">➕ Add to Trip</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

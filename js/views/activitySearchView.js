// Activity Search & Discovery System
import { db } from '../db/database.js';
import { formatINR } from '../utils/formatters.js';

export function renderActivitySearchView(searchQuery = '', categoryFilter = 'All') {
  let activities = db.getAll('activities');
  const cities = db.getAll('cities');

  if (categoryFilter !== 'All') {
    activities = activities.filter(a => a.category === categoryFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    activities = activities.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
  }

  return `
    <div>
      <div style="margin-bottom:2rem;">
        <span class="badge badge-coral">Experiences</span>
        <h1 style="font-size: 2.2rem; margin-top: 0.25rem;">Activity Discovery Catalog</h1>
        <p style="color:var(--text-muted); font-size:1rem;">Discover top rated tours, heritage walks, water sports, and culinary experiences.</p>
      </div>

      <!-- Filters -->
      <div class="card" style="margin-bottom: 2rem; padding: 1.25rem;">
        <div class="grid-2">
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.85rem;">Search Activity Title or Keywords</label>
            <input type="text" class="form-control" placeholder="🔍 Search e.g. Scuba, Palace, Sunset..." value="${searchQuery}" onkeyup="window.GlobeTrotter.handleActivitySearch(this.value)">
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.85rem;">Filter Category</label>
            <select class="form-control" onchange="window.GlobeTrotter.handleActivityCategoryFilter(this.value)">
              <option value="All" ${categoryFilter === 'All' ? 'selected' : ''}>All Categories</option>
              <option value="Sightseeing" ${categoryFilter === 'Sightseeing' ? 'selected' : ''}>Sightseeing</option>
              <option value="Cultural" ${categoryFilter === 'Cultural' ? 'selected' : ''}>Cultural & Heritage</option>
              <option value="Adventure" ${categoryFilter === 'Adventure' ? 'selected' : ''}>Adventure & Outdoor</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Activity Grid -->
      <div class="grid-3">
        ${activities.map(act => {
          const city = cities.find(c => c.id === act.city_id);
          return `
            <div class="card" style="display:flex; flex-direction:column; padding:0; overflow:hidden;">
              <div style="position:relative;">
                <img src="${act.image}" style="width:100%; height:160px; object-fit:cover;" alt="${act.title}">
                <span class="badge badge-coral" style="position:absolute; top:12px; right:12px;">${act.category}</span>
                <span class="badge badge-blue" style="position:absolute; top:12px; left:12px;">📍 ${city ? city.name : 'India'}</span>
              </div>

              <div style="padding:1.25rem; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <h3 style="font-size:1.15rem; margin-bottom:0.4rem;">${act.title}</h3>
                  <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.75rem;">${act.description}</p>
                </div>

                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:0.75rem; margin-top:0.5rem; margin-bottom:1rem;">
                    <div>
                      <span style="font-weight:800; font-size:1.2rem; color:var(--primary-coral);">${formatINR(act.cost)}</span>
                      <span style="font-size:0.8rem; color:var(--text-muted);">/ person</span>
                    </div>
                    <span style="font-size:0.85rem; font-weight:600; color:var(--peacock-blue);">⏱️ ${act.duration} hrs</span>
                  </div>

                  <button class="btn btn-primary" style="width:100%;" onclick="window.GlobeTrotter.openAddActivityToTripModal('${act.id}')">
                    ➕ Add to Trip Stop
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

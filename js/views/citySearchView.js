// Destination & City Search Discovery View with Live Weather Intelligence
import { db } from '../db/database.js';
import { getCityWeather } from '../config/apiKeys.js';

export function renderCitySearchView(searchQuery = '', regionFilter = 'All', costFilter = 'All') {
  let cities = db.getAll('cities');

  if (regionFilter !== 'All') {
    cities = cities.filter(c => c.region === regionFilter);
  }

  if (costFilter !== 'All') {
    cities = cities.filter(c => c.cost_index === costFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    cities = cities.filter(c => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }

  return `
    <div>
      <div style="margin-bottom:2rem;">
        <span class="badge badge-coral">Destinations</span>
        <h1 style="font-size: 2.2rem; margin-top: 0.25rem;">Explore Destinations in India</h1>
        <p style="color:var(--text-muted); font-size:1rem;">Discover royal palaces, tropical beaches, salt deserts, and Himalayan retreats with real-time weather intelligence.</p>
      </div>

      <!-- Search & Filter Controls -->
      <div class="card" style="margin-bottom: 2rem; padding: 1.25rem;">
        <div class="grid-3">
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.85rem;">Search City or State</label>
            <input type="text" class="form-control" placeholder="🔍 Search e.g. Udaipur, Goa..." value="${searchQuery}" onkeyup="window.GlobeTrotter.handleCitySearch(this.value)">
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.85rem;">Filter Region</label>
            <select class="form-control" onchange="window.GlobeTrotter.handleCityRegionFilter(this.value)">
              <option value="All" ${regionFilter === 'All' ? 'selected' : ''}>All Regions</option>
              <option value="North-West" ${regionFilter === 'North-West' ? 'selected' : ''}>North-West (Rajasthan)</option>
              <option value="West Coast" ${regionFilter === 'West Coast' ? 'selected' : ''}>West Coast (Goa)</option>
              <option value="South" ${regionFilter === 'South' ? 'selected' : ''}>South India (Kerala)</option>
              <option value="Himalayas" ${regionFilter === 'Himalayas' ? 'selected' : ''}>Himalayas (Himachal/UK)</option>
              <option value="West" ${regionFilter === 'West' ? 'selected' : ''}>West India (Kutch/Maharashtra)</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.85rem;">Filter Cost Index</label>
            <select class="form-control" onchange="window.GlobeTrotter.handleCityCostFilter(this.value)">
              <option value="All" ${costFilter === 'All' ? 'selected' : ''}>All Cost Tiers</option>
              <option value="₹" ${costFilter === '₹' ? 'selected' : ''}>Budget (₹)</option>
              <option value="₹₹" ${costFilter === '₹₹' ? 'selected' : ''}>Moderate (₹₹)</option>
              <option value="₹₹₹" ${costFilter === '₹₹₹' ? 'selected' : ''}>Premium (₹₹₹)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- City Cards Grid -->
      <div class="grid-3">
        ${cities.map(city => {
          const weather = getCityWeather(city.name);
          return `
            <div class="city-card">
              <div style="position:relative;">
                <img src="${city.image}" class="city-card-img" alt="${city.name}">
                <span class="badge badge-coral" style="position:absolute; top:12px; right:12px;">${city.cost_index}</span>
                <span class="badge badge-gold" style="position:absolute; top:12px; left:12px;">★ ${city.popularity}% Popular</span>
                <span class="badge badge-blue" style="position:absolute; bottom:12px; left:12px;">${weather.icon} ${weather.temp}°C • ${weather.condition}</span>
              </div>

              <div class="city-card-body">
                <h3 style="font-size:1.3rem; margin-bottom:0.25rem;">${city.name}</h3>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.75rem;">${city.state}, ${city.country}</p>
                <p style="font-size:0.9rem; color:var(--text-main); margin-bottom:1rem; flex:1;">${city.description}</p>
                
                <div style="background:var(--bg-warm-subtle); padding:0.65rem; border-radius:var(--radius-sm); font-size:0.8rem; display:flex; justify-content:space-between; margin-bottom:1rem;">
                  <span>⏱️ Rec Duration: <strong>${city.recommended_duration}</strong></span>
                  <span>☀️ Best Season: <strong>${city.best_season}</strong></span>
                </div>

                <div class="city-meta">
                  <button class="btn btn-primary" style="width:100%;" onclick="window.GlobeTrotter.addCityToTripModal('${city.id}')">
                    ➕ Add Destination to Trip
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

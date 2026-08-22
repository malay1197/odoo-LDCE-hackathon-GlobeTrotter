// Premium Landing Page View for GlobeTrotter
import { db } from '../db/database.js';

export function renderLandingView() {
  const cities = db.getAll('cities').slice(0, 4);

  return `
    <div class="hero-section">
      <div class="hero-badge">
        ✨ Powered by Next-Gen 2D Travel Intelligence & Indian Identity
      </div>
      <h1 class="hero-title">
        PLAN LESS.<br/>
        <span class="coral">TRAVEL MORE.</span>
      </h1>
      <p class="hero-subtitle">
        Build personalized multi-city journeys, manage your budget in ₹ INR, and discover unforgettable experiences — all in one intelligent travel workspace.
      </p>

      <div class="hero-ctas">
        <button class="btn btn-primary btn-lg" onclick="window.location.hash = '#signup'">
          ✨ Start Planning Free
        </button>
        <button class="btn btn-secondary btn-lg" onclick="window.location.hash = '#destinations'">
          Explore Destinations
        </button>
      </div>
    </div>

    <!-- Feature Preview Grid -->
    <div style="margin-bottom: 4rem;">
      <div style="text-align: center; margin-bottom: 2rem;">
        <span class="badge badge-coral">Why GlobeTrotter</span>
        <h2 style="font-size: 2.2rem; margin-top: 0.5rem;">Everything you need for seamless travel</h2>
      </div>

      <div class="grid-3">
        <div class="card">
          <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">🗺️</div>
          <h3 class="card-title">Multi-City Itinerary Builder</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            Seamlessly build day-by-day itineraries, add city stops, reorder destinations, and assign local experiences.
          </p>
        </div>

        <div class="card">
          <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">💰</div>
          <h3 class="card-title">Real-Time ₹ INR Budget Analytics</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            Automatic cost tracking across Transport, Stay, Activities, and Meals with instant over-budget alerts and daily averages.
          </p>
        </div>

        <div class="card">
          <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">🤖</div>
          <h3 class="card-title">AI Trip Copilot & Optimizer</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            Intelligent assistant that optimizes your routes, predicts cost savings, and generates personalized recommendations.
          </p>
        </div>
      </div>
    </div>

    <!-- Popular Destinations Showcase -->
    <div style="margin-bottom: 4rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
        <div>
          <span class="badge badge-blue">Trending India</span>
          <h2 style="font-size: 2rem; margin-top: 0.25rem;">Popular Destinations</h2>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.location.hash = '#destinations'">View All Cities →</button>
      </div>

      <div class="grid-4">
        ${cities.map(city => `
          <div class="city-card">
            <img src="${city.image}" class="city-card-img" alt="${city.name}">
            <div class="city-card-body">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <h4 style="font-size:1.15rem;">${city.name}</h4>
                <span class="badge badge-coral">${city.cost_index}</span>
              </div>
              <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">${city.state}, India</p>
              <p style="font-size:0.88rem; color:var(--text-main); margin-bottom:1rem; flex:1;">${city.description}</p>
              <div class="city-meta">
                <span style="font-size:0.8rem; font-weight:600; color:var(--peacock-blue);">⏱️ ${city.recommended_duration}</span>
                <button class="btn btn-primary btn-sm" onclick="window.location.hash = '#signup'">Explore</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Travel Stats Section -->
    <div class="card" style="background: linear-gradient(135deg, #FFF8E1, #FFE0B2); border-color: #FFE082; padding: 2.5rem; text-align: center; margin-bottom: 3rem;">
      <h2 style="font-size: 2.2rem; margin-bottom: 1.5rem; color: var(--primary-saffron);">GlobeTrotter Impact</h2>
      <div class="grid-4">
        <div>
          <div style="font-size: 2.5rem; font-weight: 800; color: var(--primary-coral);">10,000+</div>
          <div style="font-weight: 600; color: var(--text-muted);">Trips Planned</div>
        </div>
        <div>
          <div style="font-size: 2.5rem; font-weight: 800; color: var(--peacock-blue);">50+</div>
          <div style="font-weight: 600; color: var(--text-muted);">Indian Destinations</div>
        </div>
        <div>
          <div style="font-size: 2.5rem; font-weight: 800; color: var(--indian-green);">₹3.5 Cr+</div>
          <div style="font-weight: 600; color: var(--text-muted);">Budgets Managed</div>
        </div>
        <div>
          <div style="font-size: 2.5rem; font-weight: 800; color: var(--ai-purple);">98.4%</div>
          <div style="font-weight: 600; color: var(--text-muted);">Satisfaction Score</div>
        </div>
      </div>
    </div>
  `;
}

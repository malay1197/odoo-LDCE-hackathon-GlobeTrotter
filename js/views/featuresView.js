// Advanced Travel Features Suite View (Phase 3 Features)
import { db } from '../db/database.js';
import { generateAITrip, processCopilotCommand } from '../utils/aiEngine.js';
import { calculateTripHealthScore, generateTripOptimization } from '../utils/optimizer.js';
import { formatINR } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';

export function renderFeaturesView(activeTab = 'ai-planner') {
  const userTrips = db.getAll('trips');
  const selectedTrip = userTrips.length > 0 ? db.getTripFullDetails(userTrips[0].id) : null;
  const healthInfo = selectedTrip ? calculateTripHealthScore(selectedTrip) : null;
  const optimizationInfo = selectedTrip ? generateTripOptimization(selectedTrip) : null;

  return `
    <div>
      <div style="margin-bottom:2rem;">
        <span class="badge badge-purple">Phase 3 Innovations</span>
        <h1 style="font-size: 2.2rem; margin-top: 0.25rem;">Smart Travel Tools & AI Suite</h1>
        <p style="color:var(--text-muted); font-size:1rem;">Intelligent copilot, budget optimizer, health scores, group expense splitter & packing assistant.</p>
      </div>

      <!-- Feature Tabs -->
      <div class="tabs" style="margin-bottom: 2rem; flex-wrap:wrap;">
        <button class="tab-btn ${activeTab === 'ai-planner' ? 'active' : ''}" onclick="window.GlobeTrotter.switchFeatureTab('ai-planner')">🤖 AI Trip Planner</button>
        <button class="tab-btn ${activeTab === 'optimizer' ? 'active' : ''}" onclick="window.GlobeTrotter.switchFeatureTab('optimizer')">⚡ Trip Optimizer</button>
        <button class="tab-btn ${activeTab === 'health' ? 'active' : ''}" onclick="window.GlobeTrotter.switchFeatureTab('health')">🏥 Trip Health Score</button>
        <button class="tab-btn ${activeTab === 'group-split' ? 'active' : ''}" onclick="window.GlobeTrotter.switchFeatureTab('group-split')">👥 Group Expense Split</button>
        <button class="tab-btn ${activeTab === 'packing' ? 'active' : ''}" onclick="window.GlobeTrotter.switchFeatureTab('packing')">🎒 Packing Assistant</button>
        <button class="tab-btn ${activeTab === 'memories' ? 'active' : ''}" onclick="window.GlobeTrotter.switchFeatureTab('memories')">📸 Travel Memories</button>
      </div>

      <!-- Tab Content Renderers -->
      ${activeTab === 'ai-planner' ? `
        <div class="card" style="padding:2.5rem; background: linear-gradient(135deg, #F3E8FF, #EDE9FE); border-color:#DDD6FE; margin-bottom:2rem;">
          <span class="badge badge-purple" style="margin-bottom:0.75rem;">AI Generator</span>
          <h2 style="font-size:1.8rem; margin-bottom:0.5rem; color:var(--ai-purple-dark);">Natural Language AI Trip Planner</h2>
          <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.5rem;">
            Describe your ideal vacation prompt in plain text (e.g. "Plan 5 days Goa under ₹30,000 for 2 people, beaches + food + adventure").
          </p>

          <form onsubmit="window.GlobeTrotter.handleAIGenerate(event)">
            <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
              <input type="text" id="ai-prompt-input" class="form-control" placeholder="Plan 5 days Goa under ₹30,000 for 2 people, beaches + food + adventure..." style="flex:1; height:50px; font-size:1rem;" required>
              <button type="submit" class="btn btn-ai btn-lg">✨ Generate Itinerary</button>
            </div>
          </form>

          <div style="margin-top:1.5rem; background:white; padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-warm);">
            <h4 style="font-size:0.95rem; margin-bottom:0.75rem; color:var(--ai-purple-dark);">💬 Try Copilot Commands on Existing Trip:</h4>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button class="btn btn-secondary btn-sm" onclick="window.GlobeTrotter.runCopilotCmd('Make my trip cheaper')">"Make my trip cheaper"</button>
              <button class="btn btn-secondary btn-sm" onclick="window.GlobeTrotter.runCopilotCmd('Add food activities')">"Add food activities"</button>
              <button class="btn btn-secondary btn-sm" onclick="window.GlobeTrotter.runCopilotCmd('Keep budget under ₹25,000')">"Keep budget under ₹25,000"</button>
            </div>
          </div>
        </div>
      ` : activeTab === 'optimizer' ? `
        <div class="card" style="padding:2rem;">
          <h3 style="margin-bottom:1rem;">⚡ Smart Trip Cost & Route Optimizer</h3>
          ${optimizationInfo ? `
            <div style="background:var(--bg-warm-subtle); padding:1.5rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                <div>
                  <div style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">BEFORE OPTIMIZATION</div>
                  <div style="font-size:1.6rem; font-weight:800; color:#DC2626;">${formatINR(optimizationInfo.originalCost)}</div>
                </div>
                <div style="font-size:2rem;">➔</div>
                <div>
                  <div style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">AFTER OPTIMIZATION</div>
                  <div style="font-size:1.6rem; font-weight:800; color:var(--indian-green);">${formatINR(optimizationInfo.optimizedCost)}</div>
                </div>
                <div>
                  <span class="badge badge-green" style="font-size:1rem; padding:0.5rem 1rem;">💰 Potential Savings: ${formatINR(optimizationInfo.savings)}</span>
                </div>
              </div>
            </div>

            <h4 style="margin-bottom:0.75rem;">Optimization Suggestions:</h4>
            <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
              ${optimizationInfo.suggestions.map(s => `
                <div style="display:flex; justify-content:space-between; background:white; border:1px solid var(--border-warm); padding:1rem; border-radius:var(--radius-md); align-items:center;">
                  <div>
                    <h5 style="font-size:1rem; font-weight:700;">${s.title}</h5>
                    <p style="font-size:0.85rem; color:var(--text-muted);">${s.description}</p>
                  </div>
                  <span style="font-weight:700; color:var(--indian-green);">Save ${formatINR(s.savings)}</span>
                </div>
              `).join('')}
            </div>

            <button class="btn btn-primary" onclick="window.GlobeTrotter.applyTripOptimization()">✨ Apply Optimization Now</button>
          ` : '<p>Select a trip to calculate optimization.</p>'}
        </div>
      ` : activeTab === 'health' ? `
        <div class="card" style="padding:2rem;">
          <h3 style="margin-bottom:1rem;">🏥 Trip Health & Feasibility Score</h3>
          ${healthInfo ? `
            <div style="display:flex; align-items:center; gap:2rem; margin-bottom:1.5rem; background:var(--bg-warm-subtle); padding:1.5rem; border-radius:var(--radius-md);">
              <div style="width:100px; height:100px; border-radius:50%; background:linear-gradient(135deg, var(--primary-coral), var(--primary-saffron)); color:white; display:flex; align-items:center; justify-content:center; font-size:2.2rem; font-weight:800;">
                ${healthInfo.score}
              </div>
              <div>
                <span class="badge badge-green" style="font-size:0.9rem;">Status: ${healthInfo.level}</span>
                <h4 style="font-size:1.4rem; margin-top:0.4rem;">Trip Health Analysis</h4>
                <p style="color:var(--text-muted); font-size:0.9rem;">Overall feasibility score evaluating budget margin, daily activity pace, and travel logistics.</p>
              </div>
            </div>

            <h4>Recommendations & Diagnostics:</h4>
            <ul style="margin-top:0.75rem; padding-left:1.25rem; color:var(--text-main); display:flex; flex-direction:column; gap:0.5rem;">
              ${healthInfo.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
          ` : '<p>No trip available.</p>'}
        </div>
      ` : activeTab === 'group-split' ? `
        <div class="card" style="padding:2rem;">
          <h3 style="margin-bottom:1rem;">👥 Group Expense Split Calculator</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">Easily split trip costs between friends and travelers.</p>

          <form onsubmit="window.GlobeTrotter.calculateGroupSplit(event)">
            <div class="grid-3" style="margin-bottom:1.5rem;">
              <div class="form-group">
                <label>Total Trip Expense (₹)</label>
                <input type="number" id="split-total" class="form-control" value="${selectedTrip ? selectedTrip.cost_breakdown.total : 45000}">
              </div>
              <div class="form-group">
                <label>Number of Travelers</label>
                <input type="number" id="split-people" class="form-control" value="3" min="1">
              </div>
              <div class="form-group" style="display:flex; align-items:flex-end;">
                <button type="submit" class="btn btn-primary" style="width:100%;">Calculate Per Person</button>
              </div>
            </div>
          </form>

          <div id="split-result" style="background:var(--primary-saffron-light); padding:1.25rem; border-radius:var(--radius-md); border:1px solid #FFE082;">
            <div style="font-size:0.9rem; color:var(--primary-saffron); font-weight:700;">CALCULATED SPLIT AMOUNT</div>
            <div style="font-size:2rem; font-weight:800; color:var(--primary-coral); margin-top:0.2rem;">${formatINR(Math.round((selectedTrip ? selectedTrip.cost_breakdown.total : 45000) / 3))} / person</div>
          </div>
        </div>
      ` : activeTab === 'packing' ? `
        <div class="card" style="padding:2rem;">
          <h3 style="margin-bottom:1rem;">🎒 Smart Packing Assistant</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">Auto-generated checklist customized for Indian travel destinations.</p>

          <div class="grid-3">
            <div style="background:var(--bg-warm-subtle); padding:1rem; border-radius:var(--radius-md);">
              <h4 style="color:var(--primary-coral); margin-bottom:0.5rem;">📄 Essentials</h4>
              <label style="display:block; font-size:0.9rem; margin-bottom:0.3rem;"><input type="checkbox" checked> Aadhaar / Passport ID</label>
              <label style="display:block; font-size:0.9rem; margin-bottom:0.3rem;"><input type="checkbox" checked> Train/Flight Tickets & Vouchers</label>
              <label style="display:block; font-size:0.9rem;"><input type="checkbox"> Cash & Payment Cards</label>
            </div>
            <div style="background:var(--bg-warm-subtle); padding:1rem; border-radius:var(--radius-md);">
              <h4 style="color:var(--peacock-blue); margin-bottom:0.5rem;">👕 Clothing & Gear</h4>
              <label style="display:block; font-size:0.9rem; margin-bottom:0.3rem;"><input type="checkbox" checked> Breathable Cotton Wear</label>
              <label style="display:block; font-size:0.9rem; margin-bottom:0.3rem;"><input type="checkbox" checked> Comfortable Walking Shoes</label>
              <label style="display:block; font-size:0.9rem;"><input type="checkbox"> Sunglasses & Sunscreen SPF 50</label>
            </div>
            <div style="background:var(--bg-warm-subtle); padding:1rem; border-radius:var(--radius-md);">
              <h4 style="color:var(--ai-purple); margin-bottom:0.5rem;">🔌 Electronics & Meds</h4>
              <label style="display:block; font-size:0.9rem; margin-bottom:0.3rem;"><input type="checkbox" checked> Phone Charger & Powerbank</label>
              <label style="display:block; font-size:0.9rem; margin-bottom:0.3rem;"><input type="checkbox" checked> First Aid & Motion Sickness Meds</label>
              <label style="display:block; font-size:0.9rem;"><input type="checkbox"> Camera & Memory Cards</label>
            </div>
          </div>
        </div>
      ` : `
        <div class="card" style="padding:2rem;">
          <h3 style="margin-bottom:1rem;">📸 Travel Memories Scrapbook</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">Recap your journeys, photos, distance traveled, and memories.</p>
          <div class="grid-2">
            <div class="card" style="background:white;">
              <img src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80" style="width:100%; height:180px; object-fit:cover; border-radius:var(--radius-md);" alt="">
              <h4 style="margin-top:0.75rem;">Udaipur Lake Pichola Memory</h4>
              <p style="font-size:0.85rem; color:var(--text-muted);">Sunset boat ride with family. Total distance: 680 km.</p>
            </div>
            <div class="card" style="background:white;">
              <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80" style="width:100%; height:180px; object-fit:cover; border-radius:var(--radius-md);" alt="">
              <h4 style="margin-top:0.75rem;">Goa Beach & Scuba Memory</h4>
              <p style="font-size:0.85rem; color:var(--text-muted);">Diving at Grande Island. Spent: ₹32,000.</p>
            </div>
          </div>
        </div>
      `}
    </div>
  `;
}

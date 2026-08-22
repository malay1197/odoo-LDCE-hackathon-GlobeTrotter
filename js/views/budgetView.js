// Trip Budget & Cost Breakdown View with Chart.js Integration
import { db } from '../db/database.js';
import { formatINR, formatDateRange } from '../utils/formatters.js';

export function renderBudgetView(tripId) {
  const trip = db.getTripFullDetails(tripId);
  if (!trip) {
    return `<div class="card" style="text-align:center; padding:3rem;"><h2>Trip Not Found</h2></div>`;
  }

  const { cost_breakdown } = trip;

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <a href="#mytrips" style="font-size:0.9rem; font-weight:600;">← My Trips</a>
            <span style="color:var(--text-light);">/</span>
            <span class="badge badge-coral">Budget Breakdown</span>
          </div>
          <h1 style="font-size: 2.2rem; margin-top: 0.25rem;">Budget & Cost Breakdown</h1>
          <p style="color:var(--text-muted); font-size:0.95rem;">
            ${trip.name} • 📅 ${formatDateRange(trip.start_date, trip.end_date)} (${trip.total_days} Days)
          </p>
        </div>

        <div style="display:flex; gap:0.75rem;">
          <button class="btn btn-primary" onclick="window.GlobeTrotter.openAddExpenseModal('${trip.id}')">
            ➕ Add Expense Item
          </button>
          <button class="btn btn-outline" onclick="window.location.hash = '#builder/${trip.id}'">
            ✏️ Back to Builder
          </button>
        </div>
      </div>

      <!-- Over Budget Warning Banner -->
      ${cost_breakdown.is_over_budget ? `
        <div class="card" style="background:#FEF2F2; border-color:#FCA5A5; margin-bottom:1.5rem; display:flex; align-items:center; gap:1rem;">
          <div style="font-size:2.5rem; color:#DC2626;">⚠️</div>
          <div style="flex:1;">
            <h4 style="color:#991B1B; font-size:1.1rem;">Budget Alert: Over Target Budget</h4>
            <p style="color:#7F1D1D; font-size:0.9rem;">
              Your current calculated trip total of <strong>${formatINR(cost_breakdown.total)}</strong> exceeds your target limit of <strong>${formatINR(cost_breakdown.budget_limit)}</strong> by <strong>${formatINR(cost_breakdown.total - cost_breakdown.budget_limit)}</strong>.
            </p>
          </div>
          <button class="btn btn-ai btn-sm" onclick="window.location.hash = '#features'">✨ Optimize Trip Budget</button>
        </div>
      ` : `
        <div class="card" style="background:#F0FDF4; border-color:#86EFAC; margin-bottom:1.5rem; display:flex; align-items:center; gap:1rem;">
          <div style="font-size:2.5rem; color:var(--indian-green);">✅</div>
          <div>
            <h4 style="color:#166534; font-size:1.1rem;">Budget On Track!</h4>
            <p style="color:#14532D; font-size:0.9rem;">
              You have <strong>${formatINR(cost_breakdown.budget_limit - cost_breakdown.total)}</strong> in buffer remaining under your target limit of ${formatINR(cost_breakdown.budget_limit)}.
            </p>
          </div>
        </div>
      `}

      <!-- Top Metric Cards -->
      <div class="grid-4" style="margin-bottom: 2rem;">
        <div class="card" style="text-align:center;">
          <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">Total Target Budget</span>
          <div style="font-size:1.8rem; font-weight:800; color:var(--text-main); margin-top:0.25rem;">${formatINR(cost_breakdown.budget_limit)}</div>
        </div>
        <div class="card" style="text-align:center;">
          <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">Total Estimated Cost</span>
          <div style="font-size:1.8rem; font-weight:800; color:var(--primary-coral); margin-top:0.25rem;">${formatINR(cost_breakdown.total)}</div>
        </div>
        <div class="card" style="text-align:center;">
          <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">Average Daily Spend</span>
          <div style="font-size:1.8rem; font-weight:800; color:var(--peacock-blue); margin-top:0.25rem;">${formatINR(cost_breakdown.daily_average)}/day</div>
        </div>
        <div class="card" style="text-align:center;">
          <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">Trip Duration</span>
          <div style="font-size:1.8rem; font-weight:800; color:var(--ai-purple); margin-top:0.25rem;">${trip.total_days} Days</div>
        </div>
      </div>

      <!-- Charts & Breakdown Section -->
      <div class="grid-2" style="margin-bottom: 2rem;">
        <!-- Pie Chart Box -->
        <div class="card">
          <h3 style="margin-bottom:1rem;">Cost Allocation by Category</h3>
          <div style="max-height: 280px; display:flex; justify-center; align-items:center;">
            <canvas id="budgetPieChart"></canvas>
          </div>
        </div>

        <!-- Expense Table -->
        <div class="card">
          <h3 style="margin-bottom:1rem;">Category Breakdown</h3>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div style="display:flex; justify-content:space-between; padding:0.65rem 1rem; background:var(--bg-warm-subtle); border-radius:var(--radius-md);">
              <span>🚗 Transport (Flights/Trains/Cabs):</span> <strong>${formatINR(cost_breakdown.transport)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding:0.65rem 1rem; background:var(--bg-warm-subtle); border-radius:var(--radius-md);">
              <span>🏨 Stay & Lodging:</span> <strong>${formatINR(cost_breakdown.stay)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding:0.65rem 1rem; background:var(--bg-warm-subtle); border-radius:var(--radius-md);">
              <span>🎟️ Activities & Sightseeing:</span> <strong>${formatINR(cost_breakdown.activities)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding:0.65rem 1rem; background:var(--bg-warm-subtle); border-radius:var(--radius-md);">
              <span>🍱 Meals & Dining:</span> <strong>${formatINR(cost_breakdown.meals)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding:0.65rem 1rem; background:var(--bg-warm-subtle); border-radius:var(--radius-md);">
              <span>🛒 Miscellaneous:</span> <strong>${formatINR(cost_breakdown.misc)}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Itemized Expense List -->
      <div class="card">
        <h3 style="margin-bottom:1rem;">Itemized Expenses</h3>
        ${trip.expenses && trip.expenses.length > 0 ? `
          <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem;">
            <thead>
              <tr style="border-bottom:2px solid var(--border-warm); color:var(--text-muted);">
                <th style="padding:0.75rem;">Category</th>
                <th style="padding:0.75rem;">Description</th>
                <th style="padding:0.75rem;">Date</th>
                <th style="padding:0.75rem; text-align:right;">Amount (₹)</th>
                <th style="padding:0.75rem; text-align:right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${trip.expenses.map(e => `
                <tr style="border-bottom:1px solid var(--border-light);">
                  <td style="padding:0.75rem;"><span class="badge badge-coral">${e.category}</span></td>
                  <td style="padding:0.75rem; font-weight:600;">${e.description}</td>
                  <td style="padding:0.75rem; color:var(--text-muted);">${e.date || 'N/A'}</td>
                  <td style="padding:0.75rem; text-align:right; font-weight:700; color:var(--primary-coral);">${formatINR(e.amount)}</td>
                  <td style="padding:0.75rem; text-align:right;">
                    <button class="btn btn-secondary btn-sm" style="color:#DC2626; padding:0.2rem 0.5rem;" onclick="window.GlobeTrotter.deleteExpense('${trip.id}', '${e.id}')">✕</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <p style="color:var(--text-muted); font-style:italic;">No custom expenses added yet. Click "Add Expense Item" above.</p>
        `}
      </div>
    </div>

    <!-- Add Expense Modal -->
    <div id="add-expense-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Add Expense Item</h3>
          <button class="modal-close" onclick="window.GlobeTrotter.closeModal('add-expense-modal')">✕</button>
        </div>
        <form onsubmit="window.GlobeTrotter.handleAddExpenseSubmit(event, '${trip.id}')">
          <div class="form-group">
            <label for="exp-category">Expense Category *</label>
            <select id="exp-category" class="form-control" required>
              <option value="Transport">Transport (Flight/Train/Cab)</option>
              <option value="Stay">Stay & Hotel</option>
              <option value="Activities">Activities & Tickets</option>
              <option value="Meals">Meals & Food</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
          <div class="form-group">
            <label for="exp-description">Description *</label>
            <input type="text" id="exp-description" class="form-control" placeholder="e.g. Taxi from station to resort" required>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label for="exp-amount">Amount (₹ INR) *</label>
              <input type="number" id="exp-amount" class="form-control" placeholder="1500" required>
            </div>
            <div class="form-group">
              <label for="exp-date">Date</label>
              <input type="date" id="exp-date" class="form-control" value="${trip.start_date}">
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; margin-top:1rem;">Add Expense</button>
        </form>
      </div>
    </div>
  `;
}

export function initBudgetChart(cost_breakdown) {
  setTimeout(() => {
    const ctx = document.getElementById('budgetPieChart');
    if (!ctx) return;

    if (window.myPieChartInstance) {
      window.myPieChartInstance.destroy();
    }

    window.myPieChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Transport', 'Stay', 'Activities', 'Meals', 'Misc'],
        datasets: [{
          data: [
            cost_breakdown.transport,
            cost_breakdown.stay,
            cost_breakdown.activities,
            cost_breakdown.meals,
            cost_breakdown.misc
          ],
          backgroundColor: ['#FF5A36', '#007791', '#7C3AED', '#FFB300', '#94A3B8']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }, 100);
}

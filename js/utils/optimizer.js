// Trip Optimizer & Health Score Utilities for GlobeTrotter

export function calculateTripHealthScore(tripDetails) {
  if (!tripDetails) return { score: 85, level: 'Good', recommendations: [] };

  const { cost_breakdown, total_days, stops } = tripDetails;
  let score = 90;
  const recommendations = [];

  // Budget Health (30 points)
  if (cost_breakdown.is_over_budget) {
    score -= 20;
    recommendations.push('Your estimated trip expenses exceed your overall budget. Consider swapping premium activities or stays.');
  } else {
    const budgetMargin = ((cost_breakdown.budget_limit - cost_breakdown.total) / cost_breakdown.budget_limit) * 100;
    if (budgetMargin > 15) {
      score += 5;
    }
  }

  // Activity Density (30 points)
  let totalActivities = 0;
  if (stops) {
    stops.forEach(s => {
      totalActivities += (s.activities ? s.activities.length : 0);
    });
  }
  const actsPerDay = totalActivities / Math.max(1, total_days);
  if (actsPerDay > 4) {
    score -= 10;
    recommendations.push('Packed schedule! More than 4 activities per day may cause travel fatigue.');
  } else if (actsPerDay < 1) {
    recommendations.push('Light schedule. Add a few cultural or food activities to enrich your daily itinerary.');
  }

  // Route Efficiency (30 points)
  if (stops && stops.length > 3 && total_days < 5) {
    score -= 15;
    recommendations.push('High city hop frequency. Consider spending at least 2 days per city to reduce travel time.');
  }

  const finalScore = Math.min(100, Math.max(40, score));
  let level = 'Excellent';
  if (finalScore < 70) level = 'Needs Optimization';
  else if (finalScore < 85) level = 'Good';

  return {
    score: finalScore,
    level,
    recommendations
  };
}

export function generateTripOptimization(tripDetails) {
  if (!tripDetails) return null;

  const currentTotal = tripDetails.cost_breakdown.total;
  const targetBudget = tripDetails.total_budget || 50000;

  // Calculate realistic optimized cost (10-15% savings)
  const savings = Math.round(currentTotal * 0.12);
  const optimizedTotal = Math.max(10000, currentTotal - savings);

  return {
    originalCost: currentTotal,
    optimizedCost: optimizedTotal,
    savings,
    suggestions: [
      {
        title: 'Group Transport Booking',
        description: 'Book AC Train 2-Tier or shared cab instead of private taxis between cities.',
        savings: Math.round(savings * 0.4)
      },
      {
        title: 'Heritage Stay Package Deal',
        description: 'Switch to partner boutique havelis offering complimentary breakfast & dinner.',
        savings: Math.round(savings * 0.35)
      },
      {
        title: 'Activity Combo Pass',
        description: 'Utilize bundled city palace & fort attraction pass for entry discounts.',
        savings: Math.round(savings * 0.25)
      }
    ]
  };
}

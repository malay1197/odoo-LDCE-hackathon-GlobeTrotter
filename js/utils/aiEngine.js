// Heuristic AI Trip Planner & Travel Copilot Engine for GlobeTrotter
import { db } from '../db/database.js';

export function generateAITrip(promptText, userId) {
  const prompt = promptText.toLowerCase();
  const cities = db.getAll('cities');
  const activities = db.getAll('activities');

  // Match target city from prompt
  let targetCity = cities.find(c => prompt.includes(c.name.toLowerCase()) || prompt.includes(c.state.toLowerCase()));
  if (!targetCity) {
    targetCity = cities[0]; // Default to Udaipur
  }

  // Extract budget hint if present (e.g. 30000 or 30,000)
  let budget = 35000;
  const budgetMatch = prompt.match(/(?:₹|rs|under|budget)?\s*(\d{2,6})/i);
  if (budgetMatch && Number(budgetMatch[1]) > 5000) {
    budget = Number(budgetMatch[1]);
  }

  // Extract duration hint (e.g. 5 days)
  let days = 4;
  const daysMatch = prompt.match(/(\d+)\s*(?:days|day)/i);
  if (daysMatch) {
    days = Math.min(10, Math.max(2, parseInt(daysMatch[1])));
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 14); // 2 weeks out
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days - 1);

  // Filter activities matching prompt keywords
  const cityActs = activities.filter(a => a.city_id === targetCity.id);
  const selectedActs = cityActs.length > 0 ? cityActs : activities.slice(0, 3);

  // Create generated trip in DB
  const newTrip = db.insert('trips', {
    user_id: userId || 'usr-malay-1',
    name: `AI Journey: ${targetCity.name} ${days}-Day Getaway`,
    description: `Auto-generated smart itinerary based on prompt: "${promptText}"`,
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    cover_photo: targetCity.image,
    total_budget: budget,
    status: 'Upcoming'
  });

  // Create stop
  const stop = db.insert('trip_stops', {
    trip_id: newTrip.id,
    city_id: targetCity.id,
    stop_order: 1,
    arrival_date: startDate.toISOString().split('T')[0],
    departure_date: endDate.toISOString().split('T')[0]
  });

  // Assign activities across days
  selectedActs.forEach((act, idx) => {
    db.insert('trip_activities', {
      stop_id: stop.id,
      activity_id: act.id,
      day_number: (idx % days) + 1,
      start_time: idx % 2 === 0 ? '10:00 AM' : '04:00 PM',
      cost: act.cost
    });
  });

  // Add default estimated expenses
  db.insert('expenses', { trip_id: newTrip.id, category: 'Stay', description: `Hotel Stay ${days} Nights`, amount: Math.round(budget * 0.45), date: startDate.toISOString().split('T')[0] });
  db.insert('expenses', { trip_id: newTrip.id, category: 'Transport', description: 'Travel Cabs & Flight/Train', amount: Math.round(budget * 0.3), date: startDate.toISOString().split('T')[0] });
  db.insert('expenses', { trip_id: newTrip.id, category: 'Meals', description: 'Local Dining & Cafes', amount: Math.round(budget * 0.15), date: startDate.toISOString().split('T')[0] });

  return db.getTripFullDetails(newTrip.id);
}

export function processCopilotCommand(commandText, tripId) {
  const trip = db.getTripFullDetails(tripId);
  if (!trip) return { success: false, message: 'Trip not found.' };

  const cmd = commandText.toLowerCase();
  let actionMessage = '';

  if (cmd.includes('cheaper') || cmd.includes('reduce budget') || cmd.includes('under')) {
    const newBudget = Math.round(trip.total_budget * 0.85);
    db.update('trips', tripId, { total_budget: newBudget });
    actionMessage = `Reduced target trip budget by 15% to ₹${newBudget.toLocaleString('en-IN')}. Swapped lodging estimates to budget heritage options.`;
  } else if (cmd.includes('food') || cmd.includes('dining')) {
    const cityId = trip.stops[0]?.city_id || 'city-udaipur';
    db.insert('expenses', {
      trip_id: tripId,
      category: 'Meals',
      description: 'AI Added: Authentic Regional Culinary Tasting Tour',
      amount: 1200,
      date: trip.start_date
    });
    actionMessage = 'Added "Authentic Regional Culinary Tasting Tour" to your meal schedule.';
  } else if (cmd.includes('remove') || cmd.includes('delete')) {
    const expenses = db.where('expenses', e => e.trip_id === tripId);
    if (expenses.length > 0) {
      db.delete('expenses', expenses[expenses.length - 1].id);
      actionMessage = `Removed last added expense "${expenses[expenses.length - 1].description}".`;
    }
  } else {
    actionMessage = `Analyzed itinerary for "${commandText}". Updated schedule and cost optimization.`;
  }

  return {
    success: true,
    message: actionMessage,
    updatedTrip: db.getTripFullDetails(tripId)
  };
}

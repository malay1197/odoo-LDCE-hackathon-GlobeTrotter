// Relational Database Engine for GlobeTrotter (IndexedDB + LocalStorage Sync)
import { SEED_CITIES, SEED_ACTIVITIES, SEED_DEMO_USER, SEED_DEMO_TRIPS } from '../models/seedData.js';

const STORAGE_KEY_PREFIX = 'globetrotter_db_';

class DatabaseEngine {
  constructor() {
    this.tables = [
      'users',
      'user_preferences',
      'trips',
      'trip_stops',
      'cities',
      'activities',
      'trip_activities',
      'expenses',
      'destinations',
      'saved_destinations',
      'shared_trips',
      'trip_members',
      'recommendations'
    ];
    this.init();
  }

  init() {
    // Initialize default tables if not already existing
    this.tables.forEach(tableName => {
      const key = `${STORAGE_KEY_PREFIX}${tableName}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });

    // Seed database if empty
    this.seedIfEmpty();
  }

  seedIfEmpty() {
    const users = this.getAll('users');
    if (users.length === 0) {
      this.insert('users', SEED_DEMO_USER);
      this.insert('user_preferences', {
        user_id: SEED_DEMO_USER.id,
        ...SEED_DEMO_USER.preferences
      });
    } else {
      // Ensure demo user password hash matches current SHA-256 of password123
      const demoUser = users.find(u => u.email.toLowerCase() === 'malay@globetrotter.io');
      if (demoUser && demoUser.password_hash !== SEED_DEMO_USER.password_hash) {
        this.update('users', demoUser.id, { password_hash: SEED_DEMO_USER.password_hash });
      }
    }

    const cities = this.getAll('cities');
    if (cities.length === 0) {
      SEED_CITIES.forEach(c => this.insert('cities', c));
    }

    const activities = this.getAll('activities');
    if (activities.length === 0) {
      SEED_ACTIVITIES.forEach(a => this.insert('activities', a));
    }

    const trips = this.getAll('trips');
    if (trips.length === 0) {
      SEED_DEMO_TRIPS.forEach(t => {
        const { stops, expenses, ...tripData } = t;
        this.insert('trips', tripData);
        if (stops) {
          stops.forEach(s => {
            const { activities: stopActs, ...stopData } = s;
            stopData.trip_id = t.id;
            this.insert('trip_stops', stopData);
            if (stopActs) {
              stopActs.forEach(act => {
                this.insert('trip_activities', {
                  id: `ta-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                  stop_id: s.id,
                  activity_id: act.activity_id,
                  day_number: act.day_number,
                  start_time: act.start_time,
                  cost: act.cost
                });
              });
            }
          });
        }
        if (expenses) {
          expenses.forEach(e => {
            e.trip_id = t.id;
            this.insert('expenses', e);
          });
        }
      });
    }
  }

  // Core Generic CRUD Operations
  getAll(tableName) {
    const key = `${STORAGE_KEY_PREFIX}${tableName}`;
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      console.error(`Failed to parse table ${tableName}`, e);
      return [];
    }
  }

  getById(tableName, id) {
    const items = this.getAll(tableName);
    return items.find(item => item.id === id) || null;
  }

  where(tableName, predicate) {
    const items = this.getAll(tableName);
    return items.filter(predicate);
  }

  insert(tableName, record) {
    const items = this.getAll(tableName);
    if (!record.id) {
      record.id = `${tableName.slice(0, 3)}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    }
    if (!record.created_at) {
      record.created_at = new Date().toISOString();
    }
    items.push(record);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${tableName}`, JSON.stringify(items));
    return record;
  }

  update(tableName, id, patch) {
    const items = this.getAll(tableName);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...patch, updated_at: new Date().toISOString() };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${tableName}`, JSON.stringify(items));
    return items[index];
  }

  delete(tableName, id) {
    const items = this.getAll(tableName);
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${tableName}`, JSON.stringify(filtered));
    return true;
  }

  // Relational Query Helpers
  getTripFullDetails(tripId) {
    const trip = this.getById('trips', tripId);
    if (!trip) return null;

    const stops = this.where('trip_stops', s => s.trip_id === tripId)
      .sort((a, b) => a.stop_order - b.stop_order);

    const fullStops = stops.map(stop => {
      const city = this.getById('cities', stop.city_id);
      const tripActivities = this.where('trip_activities', ta => ta.stop_id === stop.id);
      const fullActivities = tripActivities.map(ta => {
        const activity = this.getById('activities', ta.activity_id);
        return {
          ...ta,
          activity_details: activity
        };
      });
      return {
        ...stop,
        city_details: city,
        activities: fullActivities
      };
    });

    const expenses = this.where('expenses', e => e.trip_id === tripId);

    // Calculate aggregated budget costs
    let totalActivityCost = 0;
    fullStops.forEach(s => {
      s.activities.forEach(act => {
        totalActivityCost += Number(act.cost || (act.activity_details ? act.activity_details.cost : 0) || 0);
      });
    });

    let transportCost = 0;
    let stayCost = 0;
    let mealCost = 0;
    let miscCost = 0;

    expenses.forEach(exp => {
      const amt = Number(exp.amount || 0);
      switch (exp.category) {
        case 'Transport': transportCost += amt; break;
        case 'Stay': stayCost += amt; break;
        case 'Meals': mealCost += amt; break;
        case 'Activities': totalActivityCost += amt; break;
        default: miscCost += amt; break;
      }
    });

    const calculatedTotalCost = transportCost + stayCost + totalActivityCost + mealCost + miscCost;
    
    // Calculate total days
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    const dailyAverageCost = Math.round(calculatedTotalCost / totalDays);

    return {
      ...trip,
      stops: fullStops,
      expenses,
      total_days: totalDays,
      cost_breakdown: {
        transport: transportCost,
        stay: stayCost,
        activities: totalActivityCost,
        meals: mealCost,
        misc: miscCost,
        total: calculatedTotalCost,
        daily_average: dailyAverageCost,
        budget_limit: trip.total_budget || 50000,
        is_over_budget: calculatedTotalCost > (trip.total_budget || 50000)
      }
    };
  }

  // Database Backup / Reset Controls
  exportJSON() {
    const dump = {};
    this.tables.forEach(t => {
      dump[t] = this.getAll(t);
    });
    return JSON.stringify(dump, null, 2);
  }

  importJSON(jsonString) {
    try {
      const dump = JSON.parse(jsonString);
      Object.keys(dump).forEach(t => {
        if (this.tables.includes(t)) {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}${t}`, JSON.stringify(dump[t]));
        }
      });
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  clearAllData() {
    this.tables.forEach(t => {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${t}`);
    });
    this.init();
  }
}

export const db = new DatabaseEngine();

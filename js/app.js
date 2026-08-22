// Main Application Controller & Hash Router for GlobeTrotter
import { auth } from './models/auth.js';
import { db } from './db/database.js';
import { renderNavbar } from './components/navbar.js';
import { showToast } from './components/toast.js';

// Views
import { renderLandingView } from './views/landingView.js';
import { renderAuthView } from './views/authView.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderCreateTripModalHTML } from './views/createTripView.js';
import { renderMyTripsView } from './views/myTripsView.js';
import { renderItineraryBuilderView } from './views/itineraryBuilderView.js';
import { renderItineraryView } from './views/itineraryView.js';
import { renderCitySearchView } from './views/citySearchView.js';
import { renderActivitySearchView } from './views/activitySearchView.js';
import { renderBudgetView, initBudgetChart } from './views/budgetView.js';
import { renderCalendarView } from './views/calendarView.js';
import { renderShareView } from './views/shareView.js';
import { renderProfileView } from './views/profileView.js';
import { renderAdminView } from './views/adminView.js';
import { renderFeaturesView } from './views/featuresView.js';

// Utilities
import { generateAITrip, processCopilotCommand } from './utils/aiEngine.js';
import { generateTripOptimization } from './utils/optimizer.js';

class GlobeTrotterApp {
  constructor() {
    this.currentView = 'landing';
    this.activeFeatureTab = 'ai-planner';
    this.myTripsFilter = 'All';
    this.myTripsSearch = '';
    this.citySearchQuery = '';
    this.cityRegionFilter = 'All';
    this.cityCostFilter = 'All';
    this.activitySearchQuery = '';
    this.activityCategoryFilter = 'All';
    this.itineraryViewMode = 'list';
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    document.addEventListener('DOMContentLoaded', () => this.handleRoute());
    this.setupGlobalHandlers();
  }

  handleRoute() {
    const hash = window.location.hash || '#landing';
    const mainView = document.getElementById('main-view');
    const headerContainer = document.getElementById('header-container');
    const modalContainer = document.getElementById('modal-container');

    // Update Header Navbar
    if (headerContainer) {
      headerContainer.innerHTML = renderNavbar();
    }

    // Always inject modal overlays
    if (modalContainer) {
      modalContainer.innerHTML = renderCreateTripModalHTML();
    }

    // Router matching
    if (hash.startsWith('#login')) {
      mainView.innerHTML = renderAuthView('login');
    } else if (hash.startsWith('#signup')) {
      mainView.innerHTML = renderAuthView('signup');
    } else if (hash.startsWith('#dashboard')) {
      if (!this.guardAuth()) return;
      mainView.innerHTML = renderDashboardView();
    } else if (hash.startsWith('#mytrips')) {
      if (!this.guardAuth()) return;
      mainView.innerHTML = renderMyTripsView(this.myTripsFilter, this.myTripsSearch);
    } else if (hash.startsWith('#builder/')) {
      if (!this.guardAuth()) return;
      const tripId = hash.split('#builder/')[1];
      mainView.innerHTML = renderItineraryBuilderView(tripId);
    } else if (hash.startsWith('#itinerary/')) {
      const tripId = hash.split('#itinerary/')[1];
      mainView.innerHTML = renderItineraryView(tripId, this.itineraryViewMode);
    } else if (hash.startsWith('#destinations')) {
      mainView.innerHTML = renderCitySearchView(this.citySearchQuery, this.cityRegionFilter, this.cityCostFilter);
    } else if (hash.startsWith('#activities')) {
      mainView.innerHTML = renderActivitySearchView(this.activitySearchQuery, this.activityCategoryFilter);
    } else if (hash.startsWith('#budget/')) {
      if (!this.guardAuth()) return;
      const tripId = hash.split('#budget/')[1];
      mainView.innerHTML = renderBudgetView(tripId);
      const trip = db.getTripFullDetails(tripId);
      if (trip) initBudgetChart(trip.cost_breakdown);
    } else if (hash.startsWith('#calendar/')) {
      const tripId = hash.split('#calendar/')[1];
      mainView.innerHTML = renderCalendarView(tripId);
    } else if (hash.startsWith('#share/')) {
      const tripId = hash.split('#share/')[1];
      mainView.innerHTML = renderShareView(tripId);
    } else if (hash.startsWith('#profile')) {
      if (!this.guardAuth()) return;
      mainView.innerHTML = renderProfileView();
    } else if (hash.startsWith('#admin')) {
      mainView.innerHTML = renderAdminView();
    } else if (hash.startsWith('#ai-planner') || hash.startsWith('#features')) {
      mainView.innerHTML = renderFeaturesView(this.activeFeatureTab);
    } else {
      mainView.innerHTML = renderLandingView();
    }

    window.scrollTo(0, 0);
  }

  guardAuth() {
    if (!auth.isAuthenticated()) {
      showToast('Please log in to access your travel workspace.', 'info');
      window.location.hash = '#login';
      return false;
    }
    return true;
  }

  setupGlobalHandlers() {
    window.GlobeTrotter = {
      // Auth Handlers
      handleAuthSubmit: async (e, mode) => {
        e.preventDefault();
        const errDiv = document.getElementById('auth-error');
        if (errDiv) errDiv.style.display = 'none';

        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;

        try {
          if (mode === 'signup') {
            const name = document.getElementById('signup-name').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            await auth.signup({ name, email, password, confirmPassword });
            showToast('Account created successfully! Welcome to GlobeTrotter.');
          } else {
            await auth.login({ email, password });
            showToast('Logged in successfully!');
          }
          window.location.hash = '#dashboard';
        } catch (err) {
          if (errDiv) {
            errDiv.innerText = err.message;
            errDiv.style.display = 'block';
          }
          showToast(err.message, 'error');
        }
      },

      openForgotPasswordModal: () => {
        const modal = document.getElementById('forgot-password-modal');
        if (modal) modal.classList.add('active');
      },

      handleForgotPasswordSubmit: async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        try {
          const res = await auth.forgotPassword(email);
          showToast(res.message, 'success');
          this.closeModal('forgot-password-modal');
        } catch (err) {
          showToast(err.message, 'error');
        }
      },

      logout: () => {
        auth.logout();
        showToast('Logged out successfully.');
      },

      // Modal Helpers
      openCreateTripModal: () => {
        if (!auth.isAuthenticated()) {
          window.location.hash = '#login';
          return;
        }
        const modal = document.getElementById('create-trip-modal');
        if (modal) modal.classList.add('active');
      },

      closeModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
      },

      // Trip Management Handlers
      handleCreateTripSubmit: (e) => {
        e.preventDefault();
        const user = auth.getUser();
        const name = document.getElementById('trip-name').value;
        const startDate = document.getElementById('trip-start-date').value;
        const endDate = document.getElementById('trip-end-date').value;
        const description = document.getElementById('trip-description').value;
        const budget = Number(document.getElementById('trip-budget').value);
        const coverPhoto = document.getElementById('trip-cover-photo').value;

        const newTrip = db.insert('trips', {
          user_id: user.id,
          name,
          start_date: startDate,
          end_date: endDate,
          description,
          total_budget: budget,
          cover_photo: coverPhoto || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
          status: 'Upcoming'
        });

        // Add default first stop (Udaipur)
        const stop = db.insert('trip_stops', {
          trip_id: newTrip.id,
          city_id: 'city-udaipur',
          stop_order: 1,
          arrival_date: startDate,
          departure_date: endDate
        });

        // Add default activity
        db.insert('trip_activities', {
          stop_id: stop.id,
          activity_id: 'act-city-palace-udr',
          day_number: 1,
          start_time: '10:00 AM',
          cost: 450
        });

        showToast(`Trip "${name}" created successfully!`);
        this.closeModal('create-trip-modal');
        window.location.hash = `#builder/${newTrip.id}`;
      },

      filterTrips: (status) => {
        this.myTripsFilter = status;
        window.location.hash = '#mytrips';
        this.handleRoute();
      },

      searchTrips: (query) => {
        this.myTripsSearch = query;
        window.location.hash = '#mytrips';
        this.handleRoute();
      },

      deleteTrip: (tripId) => {
        if (confirm('Are you sure you want to delete this trip itinerary?')) {
          db.delete('trips', tripId);
          showToast('Trip deleted successfully.');
          this.handleRoute();
        }
      },

      duplicateTrip: (tripId) => {
        const trip = db.getTripFullDetails(tripId);
        if (!trip) return;
        const user = auth.getUser();

        const cloned = db.insert('trips', {
          user_id: user ? user.id : 'usr-malay-1',
          name: `${trip.name} (Copy)`,
          description: trip.description,
          start_date: trip.start_date,
          end_date: trip.end_date,
          total_budget: trip.total_budget,
          cover_photo: trip.cover_photo,
          status: 'Upcoming'
        });

        if (trip.stops) {
          trip.stops.forEach(s => {
            const stop = db.insert('trip_stops', {
              trip_id: cloned.id,
              city_id: s.city_id,
              stop_order: s.stop_order,
              arrival_date: s.arrival_date,
              departure_date: s.departure_date
            });
            if (s.activities) {
              s.activities.forEach(act => {
                db.insert('trip_activities', {
                  stop_id: stop.id,
                  activity_id: act.activity_id,
                  day_number: act.day_number,
                  start_time: act.start_time,
                  cost: act.cost
                });
              });
            }
          });
        }

        showToast('Cloned copy created in your trip library!');
        window.location.hash = `#builder/${cloned.id}`;
      },

      shareTrip: (tripId) => {
        window.location.hash = `#share/${tripId}`;
      },

      copySharedTrip: (tripId) => {
        this.GlobeTrotter.duplicateTrip(tripId);
      },

      copyCurrentLink: () => {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      },

      // Itinerary Builder Operations
      openAddStopModal: (tripId) => {
        const modal = document.getElementById('add-stop-modal');
        if (modal) modal.classList.add('active');
      },

      handleAddStopSubmit: (e, tripId) => {
        e.preventDefault();
        const cityId = document.getElementById('stop-city-id').value;
        const arrDate = document.getElementById('stop-arrival-date').value;
        const depDate = document.getElementById('stop-departure-date').value;

        const stops = db.where('trip_stops', s => s.trip_id === tripId);
        db.insert('trip_stops', {
          trip_id: tripId,
          city_id: cityId,
          stop_order: stops.length + 1,
          arrival_date: arrDate,
          departure_date: depDate
        });

        showToast('City stop added to itinerary!');
        this.closeModal('add-stop-modal');
        this.handleRoute();
      },

      reorderStop: (tripId, stopId, direction) => {
        const stops = db.where('trip_stops', s => s.trip_id === tripId).sort((a,b) => a.stop_order - b.stop_order);
        const idx = stops.findIndex(s => s.id === stopId);
        if (idx === -1) return;

        if (direction === 'up' && idx > 0) {
          const temp = stops[idx].stop_order;
          stops[idx].stop_order = stops[idx - 1].stop_order;
          stops[idx - 1].stop_order = temp;
          db.update('trip_stops', stops[idx].id, { stop_order: stops[idx].stop_order });
          db.update('trip_stops', stops[idx - 1].id, { stop_order: stops[idx - 1].stop_order });
        } else if (direction === 'down' && idx < stops.length - 1) {
          const temp = stops[idx].stop_order;
          stops[idx].stop_order = stops[idx + 1].stop_order;
          stops[idx + 1].stop_order = temp;
          db.update('trip_stops', stops[idx].id, { stop_order: stops[idx].stop_order });
          db.update('trip_stops', stops[idx + 1].id, { stop_order: stops[idx + 1].stop_order });
        }
        this.handleRoute();
      },

      removeStop: (tripId, stopId) => {
        if (confirm('Remove this city stop and its assigned activities?')) {
          db.delete('trip_stops', stopId);
          showToast('City stop removed.');
          this.handleRoute();
        }
      },

      openAddActivityModal: (stopId, cityId) => {
        window.location.hash = '#activities';
      },

      removeTripActivity: (tripId, tripActivityId) => {
        db.delete('trip_activities', tripActivityId);
        showToast('Activity removed from stop.');
        this.handleRoute();
      },

      switchItineraryMode: (tripId, mode) => {
        this.itineraryViewMode = mode;
        this.handleRoute();
      },

      // Budget Operations
      openAddExpenseModal: (tripId) => {
        const modal = document.getElementById('add-expense-modal');
        if (modal) modal.classList.add('active');
      },

      handleAddExpenseSubmit: (e, tripId) => {
        e.preventDefault();
        const category = document.getElementById('exp-category').value;
        const description = document.getElementById('exp-description').value;
        const amount = Number(document.getElementById('exp-amount').value);
        const date = document.getElementById('exp-date').value;

        db.insert('expenses', {
          trip_id: tripId,
          category,
          description,
          amount,
          date
        });

        showToast('Expense item added!');
        this.closeModal('add-expense-modal');
        this.handleRoute();
      },

      deleteExpense: (tripId, expId) => {
        db.delete('expenses', expId);
        showToast('Expense item deleted.');
        this.handleRoute();
      },

      // Destination & City Search Filters
      handleCitySearch: (query) => {
        this.citySearchQuery = query;
        this.handleRoute();
      },
      handleCityRegionFilter: (region) => {
        this.cityRegionFilter = region;
        this.handleRoute();
      },
      handleCityCostFilter: (cost) => {
        this.cityCostFilter = cost;
        this.handleRoute();
      },
      addCityToTripModal: (cityId) => {
        if (!auth.isAuthenticated()) {
          window.location.hash = '#login';
          return;
        }
        const userTrips = db.where('trips', t => t.user_id === auth.getUser().id);
        if (userTrips.length === 0) {
          showToast('Please create a trip first to add this destination.', 'info');
          this.GlobeTrotter.openCreateTripModal();
          return;
        }
        const targetTrip = userTrips[0];
        const stops = db.where('trip_stops', s => s.trip_id === targetTrip.id);
        db.insert('trip_stops', {
          trip_id: targetTrip.id,
          city_id: cityId,
          stop_order: stops.length + 1,
          arrival_date: targetTrip.start_date,
          departure_date: targetTrip.end_date
        });
        showToast(`Added destination stop to "${targetTrip.name}"!`);
        window.location.hash = `#builder/${targetTrip.id}`;
      },

      // Activity Search Filters
      handleActivitySearch: (query) => {
        this.activitySearchQuery = query;
        this.handleRoute();
      },
      handleActivityCategoryFilter: (category) => {
        this.activityCategoryFilter = category;
        this.handleRoute();
      },
      openAddActivityToTripModal: (activityId) => {
        if (!auth.isAuthenticated()) {
          window.location.hash = '#login';
          return;
        }
        const userTrips = db.where('trips', t => t.user_id === auth.getUser().id);
        if (userTrips.length === 0) {
          showToast('Please create a trip first to assign activities.', 'info');
          this.GlobeTrotter.openCreateTripModal();
          return;
        }
        const trip = db.getTripFullDetails(userTrips[0].id);
        if (!trip.stops || trip.stops.length === 0) {
          showToast('Add a city stop to your trip before assigning activities.', 'info');
          window.location.hash = `#builder/${trip.id}`;
          return;
        }
        const stop = trip.stops[0];
        const act = db.getById('activities', activityId);
        db.insert('trip_activities', {
          stop_id: stop.id,
          activity_id: activityId,
          day_number: 1,
          start_time: '10:00 AM',
          cost: act ? act.cost : 500
        });
        showToast(`Assigned activity to trip "${trip.name}"!`);
        window.location.hash = `#builder/${trip.id}`;
      },

      // Feature Tabs
      switchFeatureTab: (tabName) => {
        this.activeFeatureTab = tabName;
        this.handleRoute();
      },

      // AI & Copilot Handlers
      handleAIGenerate: (e) => {
        e.preventDefault();
        const promptInput = document.getElementById('ai-prompt-input').value;
        const user = auth.getUser();
        const generated = generateAITrip(promptInput, user ? user.id : 'usr-malay-1');
        showToast('AI Trip generated successfully!');
        window.location.hash = `#builder/${generated.id}`;
      },

      runCopilotCmd: (cmd) => {
        const trips = db.getAll('trips');
        if (trips.length === 0) return;
        const res = processCopilotCommand(cmd, trips[0].id);
        if (res.success) {
          showToast(`Copilot: ${res.message}`, 'info');
          this.handleRoute();
        }
      },

      applyTripOptimization: () => {
        const trips = db.getAll('trips');
        if (trips.length === 0) return;
        const trip = db.getTripFullDetails(trips[0].id);
        const opt = generateTripOptimization(trip);
        if (opt) {
          db.update('trips', trip.id, { total_budget: opt.optimizedCost });
          showToast(`Applied optimization! Reduced budget target to ${opt.optimizedCost.toLocaleString('en-IN')}.`);
          this.handleRoute();
        }
      },

      calculateGroupSplit: (e) => {
        e.preventDefault();
        const total = Number(document.getElementById('split-total').value);
        const people = Number(document.getElementById('split-people').value);
        const perPerson = Math.round(total / Math.max(1, people));
        const resDiv = document.getElementById('split-result');
        if (resDiv) {
          resDiv.innerHTML = `
            <div style="font-size:0.9rem; color:var(--primary-saffron); font-weight:700;">CALCULATED SPLIT AMOUNT</div>
            <div style="font-size:2rem; font-weight:800; color:var(--primary-coral); margin-top:0.2rem;">₹${perPerson.toLocaleString('en-IN')} / person</div>
          `;
        }
      },

      // Profile Handlers
      handleSaveProfile: (e) => {
        e.preventDefault();
        const name = document.getElementById('prof-name').value;
        const user = auth.getUser();
        if (user) {
          db.update('users', user.id, { name });
          auth.saveSession({ ...user, name });
          showToast('Profile settings saved!');
          this.handleRoute();
        }
      },

      exportDatabaseJSON: () => {
        const json = db.exportJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `globetrotter_db_backup_${Date.now()}.json`;
        a.click();
        showToast('Database exported successfully!');
      },

      importDatabaseJSON: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const success = db.importJSON(event.target.result);
              if (success) {
                showToast('Database imported successfully!');
                this.handleRoute();
              } else {
                showToast('Failed to import database JSON.', 'error');
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
      },

      confirmDeleteAccount: () => {
        if (confirm('Are you sure you want to delete your account and clear your trips data?')) {
          db.clearAllData();
          auth.logout();
          showToast('Account deleted. Database reset.');
        }
      }
    };
  }
}

new GlobeTrotterApp();

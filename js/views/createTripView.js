// Create Trip Modal & Form Handler
import { auth } from '../models/auth.js';
import { db } from '../db/database.js';
import { showToast } from '../components/toast.js';

export function renderCreateTripModalHTML() {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return `
    <div id="create-trip-modal" class="modal-overlay">
      <div class="modal-card" style="max-width: 650px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-coral">New Journey</span>
            <h2 style="font-size: 1.5rem; margin-top: 0.25rem;">Create Travel Itinerary</h2>
          </div>
          <button class="modal-close" onclick="window.GlobeTrotter.closeModal('create-trip-modal')">✕</button>
        </div>

        <form id="create-trip-form" onsubmit="window.GlobeTrotter.handleCreateTripSubmit(event)">
          <div class="form-group">
            <label for="trip-name">Trip Name *</label>
            <input type="text" id="trip-name" class="form-control" placeholder="e.g. Royal Rajasthan & Lakes Tour" required>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label for="trip-start-date">Start Date *</label>
              <input type="date" id="trip-start-date" class="form-control" value="${today}" required>
            </div>
            <div class="form-group">
              <label for="trip-end-date">End Date *</label>
              <input type="date" id="trip-end-date" class="form-control" value="${nextWeek}" required>
            </div>
          </div>

          <div class="form-group">
            <label for="trip-description">Trip Description *</label>
            <textarea id="trip-description" class="form-control" placeholder="Describe the goal of your journey..." required></textarea>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label for="trip-starting-location">Starting Location</label>
              <input type="text" id="trip-starting-location" class="form-control" placeholder="e.g. New Delhi / Mumbai">
            </div>
            <div class="form-group">
              <label for="trip-budget">Target Budget (₹ INR) *</label>
              <input type="number" id="trip-budget" class="form-control" placeholder="50000" value="45000" step="500" required>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label for="trip-travelers">Number of Travelers</label>
              <input type="number" id="trip-travelers" class="form-control" value="2" min="1" max="20">
            </div>
            <div class="form-group">
              <label for="trip-travel-style">Travel Style</label>
              <select id="trip-travel-style" class="form-control">
                <option value="Cultural & Heritage">Cultural & Heritage</option>
                <option value="Backpacker & Budget">Backpacker & Budget</option>
                <option value="Luxury & Relaxation">Luxury & Relaxation</option>
                <option value="Adventure & Nature">Adventure & Nature</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="trip-cover-photo">Optional Cover Photo URL</label>
            <input type="url" id="trip-cover-photo" class="form-control" placeholder="https://images.unsplash.com/photo-...">
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="window.GlobeTrotter.closeModal('create-trip-modal')">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Trip & Build Itinerary</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Authentication View (Login, Signup & Forgot Password)
import { auth } from '../models/auth.js';
import { showToast } from '../components/toast.js';

export function renderAuthView(mode = 'login') {
  const isLogin = mode === 'login';

  return `
    <div style="max-width: 460px; margin: 3rem auto;">
      <div class="card" style="padding: 2.5rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="brand-logo" style="justify-content: center; margin-bottom: 0.75rem;">
            <div class="logo-icon">🧳</div>
            <div>Globe<span class="accent">Trotter</span></div>
          </div>
          <h2 style="font-size: 1.6rem; margin-bottom: 0.25rem;">
            ${isLogin ? 'Welcome Back 👋' : 'Create Your Free Account'}
          </h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">
            ${isLogin ? 'Sign in to access your multi-city itineraries and budget tools' : 'Start building personalized travel itineraries in seconds'}
          </p>
        </div>

        <div class="tabs">
          <button class="tab-btn ${isLogin ? 'active' : ''}" onclick="window.location.hash = '#login'">Log In</button>
          <button class="tab-btn ${!isLogin ? 'active' : ''}" onclick="window.location.hash = '#signup'">Sign Up</button>
        </div>

        <form id="auth-form" onsubmit="window.GlobeTrotter.handleAuthSubmit(event, '${mode}')">
          <div id="auth-error" style="display:none; background:#FEE2E2; color:#B91C1C; padding:0.75rem 1rem; border-radius:var(--radius-md); font-size:0.88rem; margin-bottom:1.25rem; font-weight:500;"></div>

          ${!isLogin ? `
            <div class="form-group">
              <label for="signup-name">Full Name</label>
              <input type="text" id="signup-name" class="form-control" placeholder="e.g. Malay Rajput" required>
            </div>
          ` : ''}

          <div class="form-group">
            <label for="auth-email">Email Address</label>
            <input type="email" id="auth-email" class="form-control" placeholder="name@example.com" value="${isLogin ? 'malay@globetrotter.io' : ''}" required>
          </div>

          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label for="auth-password">Password</label>
              ${isLogin ? `
                <a href="javascript:void(0)" onclick="window.GlobeTrotter.openForgotPasswordModal()" style="font-size:0.82rem; font-weight:600;">Forgot Password?</a>
              ` : ''}
            </div>
            <input type="password" id="auth-password" class="form-control" placeholder="••••••••" value="${isLogin ? 'password123' : ''}" required>
          </div>

          ${!isLogin ? `
            <div class="form-group">
              <label for="signup-confirm-password">Confirm Password</label>
              <input type="password" id="signup-confirm-password" class="form-control" placeholder="••••••••" required>
            </div>
          ` : ''}

          <button type="submit" id="auth-submit-btn" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 1rem; margin-top: 0.5rem;">
            ${isLogin ? 'Sign In to Dashboard' : 'Create Account & Start Planning'}
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.5rem; font-size: 0.88rem; color: var(--text-muted);">
          ${isLogin ? `
            Don't have an account? <a href="#signup" style="font-weight:600;">Sign up free</a>
          ` : `
            Already have an account? <a href="#login" style="font-weight:600;">Log in here</a>
          `}
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div id="forgot-password-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Reset Your Password</h3>
          <button class="modal-close" onclick="window.GlobeTrotter.closeModal('forgot-password-modal')">✕</button>
        </div>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.25rem;">
          Enter your registered email address and we'll send you instructions to reset your password.
        </p>
        <form onsubmit="window.GlobeTrotter.handleForgotPasswordSubmit(event)">
          <div class="form-group">
            <label for="forgot-email">Email Address</label>
            <input type="email" id="forgot-email" class="form-control" placeholder="name@example.com" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Send Reset Link</button>
        </form>
      </div>
    </div>
  `;
}

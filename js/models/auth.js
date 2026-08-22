// Authentication & User Session Management for GlobeTrotter
import { db } from '../db/database.js';

const SESSION_KEY = 'globetrotter_session';

class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
  }

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  loadSession() {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return null;
      const parsed = JSON.parse(sessionData);
      // Validate token validity
      if (parsed.expires_at && new Date(parsed.expires_at) < new Date()) {
        this.logout();
        return null;
      }
      return parsed.user;
    } catch (e) {
      return null;
    }
  }

  saveSession(user) {
    const session = {
      token: `jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || user.name.split(' ').map(n=>n[0]).join('').toUpperCase()
      },
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.currentUser = session.user;
    return session;
  }

  async signup({ name, email, password, confirmPassword }) {
    // Validations
    if (!name || !email || !password) {
      throw new Error('All fields are required.');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const existingUsers = db.where('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUsers.length > 0) {
      throw new Error('An account with this email already exists.');
    }

    const password_hash = await this.hashPassword(password);
    const avatar = name.split(' ').map(n=>n[0]).join('').toUpperCase().substring(0, 2);

    const newUser = db.insert('users', {
      name,
      email: email.toLowerCase(),
      password_hash,
      avatar,
      created_at: new Date().toISOString()
    });

    db.insert('user_preferences', {
      user_id: newUser.id,
      travel_style: 'Cultural & Moderate',
      language: 'English',
      favorite_interests: ['Historical Monuments', 'Local Food']
    });

    return this.saveSession(newUser);
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Please provide email and password.');
    }

    const users = db.where('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (users.length === 0) {
      throw new Error('Invalid email or password.');
    }

    const user = users[0];
    const password_hash = await this.hashPassword(password);

    // Accept matching hash OR default demo password for pre-seeded user
    const isDemoAccount = user.email.toLowerCase() === 'malay@globetrotter.io' && password === 'password123';
    if (user.password_hash !== password_hash && !isDemoAccount) {
      throw new Error('Invalid email or password.');
    }

    return this.saveSession(user);
  }

  async forgotPassword(email) {
    const users = db.where('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (users.length === 0) {
      throw new Error('No user found with this email address.');
    }
    // Simulate sending password reset instructions
    return {
      success: true,
      message: `Password reset instructions have been sent to ${email}.`
    };
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
    this.currentUser = null;
    window.location.hash = '#login';
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getUser() {
    return this.currentUser;
  }
}

export const auth = new AuthService();

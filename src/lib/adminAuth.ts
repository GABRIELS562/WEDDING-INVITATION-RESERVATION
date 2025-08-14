/**
 * Admin Authentication Service
 * Dale & Kirsten's Wedding Admin Dashboard
 * 
 * Simple but secure authentication system for wedding admin access
 */

import { AdminSession, AdminAuthState, ADMIN_CONFIG } from '@/types/admin';

interface LoginAttempt {
  timestamp: number;
  success: boolean;
  ip?: string;
}

class AdminAuthService {
  private storageKey = 'wedding-admin-session';
  private attemptsKey = 'wedding-admin-attempts';
  private lockoutKey = 'wedding-admin-lockout';
  
  private listeners: ((state: AdminAuthState) => void)[] = [];
  private activityTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;

  /**
   * Initialize authentication service
   */
  constructor() {
    if (typeof window !== 'undefined') {
      this.startActivityMonitoring();
      this.checkExistingSession();
    }
  }

  /**
   * Authenticate with password
   */
  async login(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if locked out
      const lockout = this.getLockoutStatus();
      if (lockout.isLocked) {
        return {
          success: false,
          error: `Too many failed attempts. Try again in ${Math.ceil(lockout.remainingTime / 1000 / 60)} minutes.`
        };
      }

      // Validate password
      if (password !== ADMIN_CONFIG.PASSWORD) {
        this.recordLoginAttempt(false);
        
        const attempts = this.getRecentAttempts();
        const remainingAttempts = ADMIN_CONFIG.MAX_LOGIN_ATTEMPTS - attempts.length;
        
        if (remainingAttempts <= 0) {
          this.setLockout();
          return {
            success: false,
            error: 'Too many failed attempts. Account locked for 15 minutes.'
          };
        }
        
        return {
          success: false,
          error: `Incorrect password. ${remainingAttempts} attempts remaining.`
        };
      }

      // Create session
      const session = this.createSession();
      this.saveSession(session);
      this.recordLoginAttempt(true);
      this.clearLockout();

      // Start session monitoring
      this.startSessionMonitoring();

      // Notify listeners
      this.notifyListeners({
        session,
        isLoading: false
      });

      // Track successful login
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'admin_login', {
          event_category: 'admin',
          event_label: 'successful_login'
        });
      }

      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  /**
   * Logout and clear session
   */
  logout(reason: 'manual' | 'timeout' | 'inactivity' = 'manual'): void {
    try {
      this.clearSession();
      this.stopSessionMonitoring();

      // Notify listeners
      this.notifyListeners({
        session: null,
        isLoading: false
      });

      // Track logout
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'admin_logout', {
          event_category: 'admin',
          event_label: reason
        });
      }

      // Show logout message
      this.showLogoutMessage(reason);

    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Get current authentication state
   */
  getAuthState(): AdminAuthState {
    const session = this.getSession();
    return {
      session,
      isLoading: false
    };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const session = this.getSession();
    return session !== null && session.isAuthenticated && !this.isSessionExpired(session);
  }

  /**
   * Get current session
   */
  getSession(): AdminSession | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return null;

      const session = JSON.parse(stored) as AdminSession;
      
      // Check if session is expired
      if (this.isSessionExpired(session)) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Update last activity timestamp
   */
  updateActivity(): void {
    const session = this.getSession();
    if (!session) return;

    session.lastActivity = Date.now();
    this.saveSession(session);
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (state: AdminAuthState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Get session time remaining
   */
  getTimeRemaining(): { minutes: number; seconds: number } | null {
    const session = this.getSession();
    if (!session) return null;

    const remaining = session.expiresAt - Date.now();
    if (remaining <= 0) return null;

    return {
      minutes: Math.floor(remaining / 1000 / 60),
      seconds: Math.floor((remaining / 1000) % 60)
    };
  }

  /**
   * Extend session if close to expiry
   */
  extendSession(): boolean {
    const session = this.getSession();
    if (!session) return false;

    const timeRemaining = session.expiresAt - Date.now();
    const extensionThreshold = 30 * 60 * 1000; // 30 minutes

    if (timeRemaining < extensionThreshold) {
      session.expiresAt = Date.now() + ADMIN_CONFIG.SESSION_TIMEOUT;
      session.lastActivity = Date.now();
      this.saveSession(session);
      return true;
    }

    return false;
  }

  // Private methods

  private createSession(): AdminSession {
    const now = Date.now();
    return {
      isAuthenticated: true,
      loginTime: now,
      lastActivity: now,
      expiresAt: now + ADMIN_CONFIG.SESSION_TIMEOUT
    };
  }

  private saveSession(session: AdminSession): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  private clearSession(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  private isSessionExpired(session: AdminSession): boolean {
    const now = Date.now();
    const sessionExpired = now > session.expiresAt;
    const inactivityExpired = now - session.lastActivity > ADMIN_CONFIG.ACTIVITY_TIMEOUT;
    
    return sessionExpired || inactivityExpired;
  }

  private checkExistingSession(): void {
    const session = this.getSession();
    if (session && !this.isSessionExpired(session)) {
      this.startSessionMonitoring();
      this.notifyListeners({
        session,
        isLoading: false
      });
    }
  }

  private startSessionMonitoring(): void {
    this.stopSessionMonitoring();

    // Check session every minute
    this.activityTimer = setInterval(() => {
      const session = this.getSession();
      if (!session || this.isSessionExpired(session)) {
        this.logout('timeout');
        return;
      }

      // Show warning 5 minutes before expiry
      const timeRemaining = session.expiresAt - Date.now();
      const warningThreshold = 5 * 60 * 1000; // 5 minutes

      if (timeRemaining <= warningThreshold && !this.warningTimer) {
        this.showExpiryWarning();
      }
    }, 60 * 1000); // Check every minute
  }

  private stopSessionMonitoring(): void {
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = null;
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  private startActivityMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const updateActivity = () => this.updateActivity();

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateActivity();
      }
    });
  }

  private notifyListeners(state: AdminAuthState): void {
    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }

  private showExpiryWarning(): void {
    if (typeof window === 'undefined') return;

    const shouldExtend = window.confirm(
      'Your admin session will expire in 5 minutes. Do you want to extend your session?'
    );

    if (shouldExtend) {
      if (this.extendSession()) {
        alert('Session extended successfully!');
      }
    } else {
      this.warningTimer = setTimeout(() => {
        this.logout('timeout');
      }, 5 * 60 * 1000);
    }
  }

  private showLogoutMessage(reason: string): void {
    if (typeof window === 'undefined') return;

    const messages = {
      manual: 'You have been logged out successfully.',
      timeout: 'Your session has expired. Please log in again.',
      inactivity: 'You have been logged out due to inactivity.'
    };

    const message = messages[reason as keyof typeof messages] || messages.manual;
    
    // Show toast notification instead of alert for better UX
    if (window.location.pathname.includes('/admin')) {
      setTimeout(() => alert(message), 100);
    }
  }

  private recordLoginAttempt(success: boolean): void {
    if (typeof window === 'undefined') return;

    try {
      const attempts = this.getRecentAttempts();
      const newAttempt: LoginAttempt = {
        timestamp: Date.now(),
        success
      };

      attempts.push(newAttempt);
      localStorage.setItem(this.attemptsKey, JSON.stringify(attempts));
    } catch (error) {
      console.error('Error recording login attempt:', error);
    }
  }

  private getRecentAttempts(): LoginAttempt[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.attemptsKey);
      if (!stored) return [];

      const attempts = JSON.parse(stored) as LoginAttempt[];
      const cutoff = Date.now() - ADMIN_CONFIG.LOCKOUT_DURATION;

      // Only return failed attempts within lockout window
      return attempts.filter(attempt => 
        !attempt.success && attempt.timestamp > cutoff
      );
    } catch (error) {
      console.error('Error getting login attempts:', error);
      return [];
    }
  }

  private setLockout(): void {
    if (typeof window === 'undefined') return;

    try {
      const lockoutUntil = Date.now() + ADMIN_CONFIG.LOCKOUT_DURATION;
      localStorage.setItem(this.lockoutKey, lockoutUntil.toString());
    } catch (error) {
      console.error('Error setting lockout:', error);
    }
  }

  private clearLockout(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.lockoutKey);
      localStorage.removeItem(this.attemptsKey);
    } catch (error) {
      console.error('Error clearing lockout:', error);
    }
  }

  private getLockoutStatus(): { isLocked: boolean; remainingTime: number } {
    if (typeof window === 'undefined') return { isLocked: false, remainingTime: 0 };

    try {
      const stored = localStorage.getItem(this.lockoutKey);
      if (!stored) return { isLocked: false, remainingTime: 0 };

      const lockoutUntil = parseInt(stored);
      const now = Date.now();
      const remainingTime = lockoutUntil - now;

      if (remainingTime <= 0) {
        this.clearLockout();
        return { isLocked: false, remainingTime: 0 };
      }

      return { isLocked: true, remainingTime };
    } catch (error) {
      console.error('Error checking lockout status:', error);
      return { isLocked: false, remainingTime: 0 };
    }
  }
}

// Export singleton instance
export const adminAuth = new AdminAuthService();
export default adminAuth;
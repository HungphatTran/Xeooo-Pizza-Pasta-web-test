export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  skipAuth?: boolean;
}

class HttpService {
  private authToken: string | null = 'mock-jwt-token-xeooo-2026';
  private refreshToken: string | null = 'mock-refresh-token-xeooo-2026';
  private csrfToken: string = 'csrf-' + Math.random().toString(36).substring(2);
  private cache = new Map<string, { data: any; expiry: number }>();
  private requestTimestamps: number[] = [];

  constructor() {
    if (typeof localStorage !== 'undefined') {
      this.authToken = localStorage.getItem('xeooo_jwt_token') || this.authToken;
      this.refreshToken = localStorage.getItem('xeooo_refresh_token') || this.refreshToken;
    }
  }

  public setTokens(auth: string, refresh: string) {
    this.authToken = auth;
    this.refreshToken = refresh;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('xeooo_jwt_token', auth);
      localStorage.setItem('xeooo_refresh_token', refresh);
    }
  }

  public clearTokens() {
    this.authToken = null;
    this.refreshToken = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('xeooo_jwt_token');
      localStorage.removeItem('xeooo_refresh_token');
    }
  }

  // Rate Limiting Guard: Max 40 requests per 10 seconds
  private checkRateLimit(): boolean {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter((ts) => now - ts < 10000);
    if (this.requestTimestamps.length >= 40) {
      console.warn('HTTP Rate Limit exceeded! Throttling request.');
      return false;
    }
    this.requestTimestamps.push(now);
    return true;
  }

  // XSS Sanitizer for input strings
  public sanitizeInput(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  public async request<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    if (!this.checkRateLimit()) {
      throw new Error('Hệ thống đang quá tải, vui lòng thử lại sau giây lát.');
    }

    const { timeoutMs = 10000, retries = 2, skipAuth = false, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers || {});
    headers.set('Content-Type', 'application/json');
    headers.set('X-CSRF-Token', this.csrfToken);

    if (!skipAuth && this.authToken) {
      headers.set('Authorization', `Bearer ${this.authToken}`);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Handle 401 Unauthorized -> Refresh Token Flow
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.performTokenRefresh();
        if (refreshed) {
          // Retry original request once
          return this.request<T>(url, { ...options, retries: 0 });
        }
      }

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      clearTimeout(timer);
      if (retries > 0 && !error.message?.includes('401')) {
        await new Promise((r) => setTimeout(r, 400));
        return this.request<T>(url, { ...options, retries: retries - 1 });
      }
      throw error;
    }
  }

  private async performTokenRefresh(): Promise<boolean> {
    try {
      const res = await fetch('/api/v1/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.token) {
          this.setTokens(json.token, json.refreshToken || this.refreshToken!);
          return true;
        }
      }
    } catch {
      // Refresh failed
    }
    this.clearTokens();
    return false;
  }
}

export const http = new HttpService();

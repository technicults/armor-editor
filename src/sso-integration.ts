// SSO/SAML Integration System
export interface SSOConfig {
  provider: 'saml' | 'oauth2' | 'oidc';
  entityId: string;
  ssoUrl: string;
  certificate: string;
  attributeMapping?: Record<string, string>;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export class SSOIntegration {
  private config: SSOConfig | null = null;
  private currentUser: UserProfile | null = null;
  private tokenRefreshTimer: number | null = null;

  constructor(config?: SSOConfig) {
    if (config) {
      this.config = config;
      this.initializeSSO();
    }
  }

  private initializeSSO() {
    // Check for existing session
    this.checkExistingSession();
    
    // Setup token refresh
    this.setupTokenRefresh();
  }

  private checkExistingSession() {
    const token = localStorage.getItem('sso_token');
    const userProfile = localStorage.getItem('user_profile');
    
    if (token && userProfile) {
      try {
        this.currentUser = JSON.parse(userProfile);
        this.validateToken(token);
      } catch (error) {
        console.error('Invalid stored session:', error);
        this.logout();
      }
    }
  }

  async initiateLogin(): Promise<void> {
    if (!this.config) throw new Error('SSO not configured');

    switch (this.config.provider) {
      case 'saml':
        this.initiateSAMLLogin();
        break;
      case 'oauth2':
        this.initiateOAuth2Login();
        break;
      case 'oidc':
        this.initiateOIDCLogin();
        break;
    }
  }

  private initiateSAMLLogin() {
    if (!this.config) return;
    
    const samlRequest = this.generateSAMLRequest();
    const encodedRequest = btoa(samlRequest);
    
    const loginUrl = `${this.config.ssoUrl}?SAMLRequest=${encodeURIComponent(encodedRequest)}`;
    window.location.href = loginUrl;
  }

  private initiateOAuth2Login() {
    if (!this.config) return;
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.entityId,
      redirect_uri: window.location.origin + '/auth/callback',
      scope: 'openid profile email',
      state: this.generateState()
    });
    
    window.location.href = `${this.config.ssoUrl}?${params}`;
  }

  private initiateOIDCLogin() {
    // Similar to OAuth2 but with OIDC specific parameters
    this.initiateOAuth2Login();
  }

  async handleCallback(params: URLSearchParams): Promise<UserProfile | null> {
    if (!this.config) return null;

    try {
      switch (this.config.provider) {
        case 'saml':
          return await this.handleSAMLCallback(params);
        case 'oauth2':
        case 'oidc':
          return await this.handleOAuthCallback(params);
      }
    } catch (error) {
      console.error('SSO callback failed:', error);
      return null;
    }
  }

  private async handleSAMLCallback(params: URLSearchParams): Promise<UserProfile | null> {
    const samlResponse = params.get('SAMLResponse');
    if (!samlResponse) return null;

    // Decode and validate SAML response
    const decodedResponse = atob(samlResponse);
    const userProfile = this.parseSAMLResponse(decodedResponse);
    
    if (userProfile) {
      this.currentUser = userProfile;
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
      return userProfile;
    }
    
    return null;
  }

  private async handleOAuthCallback(params: URLSearchParams): Promise<UserProfile | null> {
    const code = params.get('code');
    const state = params.get('state');
    
    if (!code || !this.validateState(state)) return null;

    // Exchange code for token
    const tokenResponse = await this.exchangeCodeForToken(code);
    if (!tokenResponse) return null;

    // Get user profile
    const userProfile = await this.getUserProfile(tokenResponse.access_token);
    if (userProfile) {
      this.currentUser = userProfile;
      localStorage.setItem('sso_token', tokenResponse.access_token);
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
    }
    
    return userProfile;
  }

  private generateSAMLRequest(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
                    ID="_${Date.now()}"
                    Version="2.0"
                    IssueInstant="${new Date().toISOString()}"
                    Destination="${this.config?.ssoUrl}">
  <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">${this.config?.entityId}</saml:Issuer>
</samlp:AuthnRequest>`;
  }

  private parseSAMLResponse(response: string): UserProfile | null {
    // Parse SAML XML response and extract user attributes
    // This is a simplified implementation
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(response, 'text/xml');
      
      // Extract user attributes based on attribute mapping
      const attributes = doc.querySelectorAll('saml\\:Attribute, Attribute');
      const userProfile: Partial<UserProfile> = {};
      
      attributes.forEach(attr => {
        const name = attr.getAttribute('Name');
        const value = attr.querySelector('saml\\:AttributeValue, AttributeValue')?.textContent;
        
        if (name && value && this.config?.attributeMapping) {
          const mappedField = this.config.attributeMapping[name];
          if (mappedField) {
            (userProfile as any)[mappedField] = value;
          }
        }
      });
      
      return userProfile as UserProfile;
    } catch (error) {
      console.error('Failed to parse SAML response:', error);
      return null;
    }
  }

  private generateState(): string {
    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem('oauth_state', state);
    return state;
  }

  private validateState(state: string | null): boolean {
    const storedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');
    return state === storedState;
  }

  private async exchangeCodeForToken(code: string): Promise<any> {
    // Exchange authorization code for access token
    const response = await fetch('/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, config: this.config })
    });
    
    return response.ok ? await response.json() : null;
  }

  private async getUserProfile(token: string): Promise<UserProfile | null> {
    const response = await fetch('/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    return response.ok ? await response.json() : null;
  }

  private async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch('/auth/validate', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private setupTokenRefresh() {
    // Refresh token every 50 minutes (assuming 1-hour expiry)
    this.tokenRefreshTimer = window.setInterval(() => {
      this.refreshToken();
    }, 50 * 60 * 1000);
  }

  private async refreshToken() {
    const token = localStorage.getItem('sso_token');
    if (!token) return;

    try {
      const response = await fetch('/auth/refresh', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const newToken = await response.text();
        localStorage.setItem('sso_token', newToken);
      } else {
        this.logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
    }
  }

  logout() {
    localStorage.removeItem('sso_token');
    localStorage.removeItem('user_profile');
    this.currentUser = null;
    
    if (this.tokenRefreshTimer) {
      clearInterval(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
    
    // Redirect to SSO logout if configured
    if (this.config?.ssoUrl) {
      window.location.href = `${this.config.ssoUrl}/logout`;
    }
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

// API Client for Unique App Backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        // Token expired, clear it and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.message || 'Request failed',
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Auth endpoints
  async signIn(email: string, password: string) {
    return this.request('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signUp(userData: {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    password: string;
    timezone: string;
    hasAcceptedTerms: boolean;
    termsAcceptedAt: string;
  }) {
    return this.request('/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async refreshToken() {
    return this.request('/auth/refresh-token', {
      method: 'POST',
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Users endpoints
  async getUsers(params?: {
    roleId?: number;
    countryId?: number;
    citizenshipCountryId?: number;
    organisationId?: number;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/users${query ? `?${query}` : ''}`);
  }

  async getUser(id: number) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: number, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Organisations endpoints
  async getOrganisations() {
    return this.request('/organisation');
  }

  async getOrganisation(id: number) {
    return this.request(`/organisation/${id}`);
  }

  async createOrganisation(orgData: {
    nameKk: string;
    nameRu: string;
    nameEn: string;
    slug: string;
    type: string;
    countryId: number;
  }) {
    return this.request('/organisation', {
      method: 'POST',
      body: JSON.stringify(orgData),
    });
  }

  async updateOrganisation(id: number, orgData: any) {
    return this.request(`/organisation/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(orgData),
    });
  }

  async deleteOrganisation(id: number) {
    return this.request(`/organisation/${id}`, {
      method: 'DELETE',
    });
  }

  // Consultations endpoints
  async getConsultations(params?: {
    clientId?: number;
    consultantId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    skip?: number;
    take?: number;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/consultations${query ? `?${query}` : ''}`);
  }

  async getConsultation(id: number) {
    return this.request(`/consultations/${id}`);
  }

  async createConsultation(consultationData: {
    clientId: number;
    consultantId: number;
    startTime: string;
    endTime: string;
    status: string;
  }) {
    return this.request('/consultations', {
      method: 'POST',
      body: JSON.stringify(consultationData),
    });
  }

  async updateConsultation(id: number, consultationData: any) {
    return this.request(`/consultations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(consultationData),
    });
  }

  // Events endpoints
  async getEvents(params?: {
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    isActive?: boolean;
    take?: number;
    skip?: number;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/event${query ? `?${query}` : ''}`);
  }

  async getEvent(id: number) {
    return this.request(`/event/id/${id}`);
  }

  async getEventBySlug(slug: string) {
    return this.request(`/event/${slug}`);
  }

  async createEvent(eventData: any) {
    return this.request('/event', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: number, eventData: any) {
    return this.request(`/event/id/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(eventData),
    });
  }

  // Promocodes endpoints
  async getPromocodes(params?: {
    search?: string;
    isActive?: boolean;
    expiresFrom?: string;
    expiresTo?: string;
    take?: number;
    skip?: number;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/promocode${query ? `?${query}` : ''}`);
  }

  async getPromocode(id: number) {
    return this.request(`/promocode/id/${id}`);
  }

  async getPromocodeByCode(code: string) {
    return this.request(`/promocode/${code}`);
  }

  async createPromocode(promoData: {
    code: string;
    discountPct?: number;
    discountAbs?: number;
    maxUses?: number;
    expiresAt?: string;
    isActive?: boolean;
  }) {
    return this.request('/promocode', {
      method: 'POST',
      body: JSON.stringify(promoData),
    });
  }

  async updatePromocode(id: number, promoData: any) {
    return this.request(`/promocode/id/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(promoData),
    });
  }

  // Tests endpoints
  async getTests() {
    return this.request('/tests');
  }

  async getTest(id: number) {
    return this.request(`/tests/${id}`);
  }

  async createTest(testData: {
    title: string;
    description?: string;
    isActive?: boolean;
  }) {
    return this.request('/tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  async updateTest(id: number, testData: any) {
    return this.request(`/tests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testData),
    });
  }

  async deleteTest(id: number) {
    return this.request(`/tests/${id}`, {
      method: 'DELETE',
    });
  }

  // Questions endpoints
  async getQuestions(testId: number) {
    return this.request(`/tests/${testId}/questions`);
  }

  async getQuestion(testId: number, id: number) {
    return this.request(`/tests/${testId}/questions/${id}`);
  }

  async createQuestion(testId: number, questionData: {
    order: number;
    text: string;
    type: string;
    options?: string[];
    required?: boolean;
  }) {
    return this.request(`/tests/${testId}/questions`, {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  }

  // Attempts endpoints
  async getAttempts(testId: number) {
    return this.request(`/tests/${testId}/attempt`);
  }

  async getAttempt(testId: number, id: number) {
    return this.request(`/tests/${testId}/attempt/${id}`);
  }

  async createAttempt(testId: number) {
    return this.request(`/tests/${testId}/attempt`, {
      method: 'POST',
    });
  }

  async updateAttempt(testId: number, id: number, data: any) {
    return this.request(`/tests/${testId}/attempt/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Responses endpoints
  async getResponses(attemptId: number) {
    return this.request(`/attempts/${attemptId}/responses`);
  }

  async createResponse(attemptId: number, responseData: {
    questionId: number;
    valueText?: string;
    valueNum?: number;
    valueOptionId?: number;
  }) {
    return this.request(`/attempts/${attemptId}/responses`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  }

  async updateResponse(attemptId: number, id: number, responseData: any) {
    return this.request(`/attempts/${attemptId}/responses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(responseData),
    });
  }

  // Meeting endpoint
  async getMeetingToken(id: string) {
    return this.request(`/meeting/${id}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { ApiClient };

export default apiClient;

import apiClient, { ApiClient } from './api-client';

// University API extensions for the Unique App backend
export interface University {
  id: number;
  nameKk: string;
  nameRu: string;
  nameEn: string;
  slug: string;
  countryId: number;
  city: string;
  ranking: number;
  descriptionKk: string;
  descriptionRu: string;
  descriptionEn: string;
  programs: string[];
  tuitionFee: number;
  currency: string;
  requirements: {
    gpa: number;
    language: string;
    tests: string[];
  };
  deadline: string;
  website: string;
  image: string;
  isPremium: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UniversityApplication {
  id: number;
  userId: number;
  universityId: number;
  program: string;
  personalStatement: string;
  gpa: number;
  testScores: Record<string, number>;
  status: 'PENDING' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  submittedAt: string;
  updatedAt: string;
}

export interface UniversityFavorite {
  id: number;
  userId: number;
  universityId: number;
  createdAt: string;
}

export interface CreateUniversityDto {
  nameKk: string;
  nameRu: string;
  nameEn: string;
  slug: string;
  countryId: number;
  city: string;
  ranking: number;
  descriptionKk: string;
  descriptionRu: string;
  descriptionEn: string;
  programs: string[];
  tuitionFee: number;
  currency: string;
  requirements: {
    gpa: number;
    language: string;
    tests: string[];
  };
  deadline: string;
  website: string;
  image: string;
  isPremium: boolean;
  isActive: boolean;
}

export interface UpdateUniversityDto {
  nameKk?: string;
  nameRu?: string;
  nameEn?: string;
  slug?: string;
  countryId?: number;
  city?: string;
  ranking?: number;
  descriptionKk?: string;
  descriptionRu?: string;
  descriptionEn?: string;
  programs?: string[];
  tuitionFee?: number;
  currency?: string;
  requirements?: {
    gpa?: number;
    language?: string;
    tests?: string[];
  };
  deadline?: string;
  website?: string;
  image?: string;
  isPremium?: boolean;
  isActive?: boolean;
}

export interface CreateApplicationDto {
  universityId: number;
  program: string;
  personalStatement: string;
  gpa: number;
  testScores: Record<string, number>;
}

class UniversityBackendAPI extends ApiClient {
  constructor() {
    super(process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1');
  }

  // Universities endpoints
  async getUniversities(params?: {
    countryId?: number;
    search?: string;
    isPremium?: boolean;
    isActive?: boolean;
    skip?: number;
    take?: number;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/universities${query ? `?${query}` : ''}`);
  }

  async getUniversity(id: number) {
    return this.request(`/universities/${id}`);
  }

  async getUniversityBySlug(slug: string) {
    return this.request(`/universities/slug/${slug}`);
  }

  async createUniversity(universityData: CreateUniversityDto) {
    return this.request('/universities', {
      method: 'POST',
      body: JSON.stringify(universityData),
    });
  }

  async updateUniversity(id: number, universityData: UpdateUniversityDto) {
    return this.request(`/universities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(universityData),
    });
  }

  async deleteUniversity(id: number) {
    return this.request(`/universities/${id}`, {
      method: 'DELETE',
    });
  }

  // Applications endpoints
  async getApplications(params?: {
    userId?: number;
    universityId?: number;
    status?: string;
    skip?: number;
    take?: number;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/university-applications${query ? `?${query}` : ''}`);
  }

  async getApplication(id: number) {
    return this.request(`/university-applications/${id}`);
  }

  async createApplication(applicationData: CreateApplicationDto) {
    return this.request('/university-applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async updateApplication(id: number, applicationData: Partial<CreateApplicationDto>) {
    return this.request(`/university-applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(applicationData),
    });
  }

  async deleteApplication(id: number) {
    return this.request(`/university-applications/${id}`, {
      method: 'DELETE',
    });
  }

  // Favorites endpoints
  async getFavorites(params?: {
    userId?: number;
    universityId?: number;
    skip?: number;
    take?: number;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/university-favorites${query ? `?${query}` : ''}`);
  }

  async addToFavorites(universityId: number) {
    return this.request('/university-favorites', {
      method: 'POST',
      body: JSON.stringify({ universityId }),
    });
  }

  async removeFromFavorites(id: number) {
    return this.request(`/university-favorites/${id}`, {
      method: 'DELETE',
    });
  }

  // Search endpoints
  async searchUniversities(query: string, params?: {
    countryId?: number;
    isPremium?: boolean;
    skip?: number;
    take?: number;
  }) {
    const searchParams = new URLSearchParams({
      q: query,
      ...params,
    } as any).toString();
    
    return this.request(`/universities/search?${searchParams}`);
  }

  // Statistics endpoints
  async getUniversityStats(id: number) {
    return this.request(`/universities/${id}/stats`);
  }

  async getUniversityPrograms(id: number) {
    return this.request(`/universities/${id}/programs`);
  }

  // Recommendations endpoints
  async getRecommendedUniversities(params?: {
    gpa?: number;
    countryId?: number;
    program?: string;
    take?: number;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/universities/recommendations${query ? `?${query}` : ''}`);
  }

  // Comparison endpoints
  async compareUniversities(universityIds: number[]) {
    return this.request('/universities/compare', {
      method: 'POST',
      body: JSON.stringify({ universityIds }),
    });
  }
}

export const universityBackendAPI = new UniversityBackendAPI();
export default universityBackendAPI;

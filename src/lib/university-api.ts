import { University, universities, getUniversityById, getUniversitiesByCountry, searchUniversities, getPremiumUniversities, getFreeUniversities } from '../data/universities';
import { getUser, isAuthed } from './auth';

export type { University };

export interface UniversityResponse {
  success: boolean;
  data?: University | University[];
  message?: string;
  requiresAuth?: boolean;
}

export interface FavoritesResponse {
  success: boolean;
  data?: string[];
  message?: string;
}

// Simulate API delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// GET /api/universities - Get all universities (public)
export const getAllUniversities = async (): Promise<UniversityResponse> => {
  await delay(600);
  return {
    success: true,
    data: universities
  };
};

// GET /api/universities/:id - Get university by ID (public for basic info, premium requires auth)
export const getUniversity = async (id: string): Promise<UniversityResponse> => {
  await delay(500);
  const university = getUniversityById(id);
  
  if (!university) {
    return {
      success: false,
      message: 'University not found'
    };
  }

  const user = getUser();
  
  // For premium universities, require authentication
  if (university.isPremium && !isAuthed()) {
    return {
      success: false,
      message: 'Premium content requires authentication',
      requiresAuth: true
    };
  }

    // Return limited data for unauthenticated users
    if (!isAuthed()) {
      const limitedData: Partial<University> = {
        ...university,
        programs: university.programs.slice(0, 2), // Show only first 2 programs
        requirements: {
          gpa: university.requirements.gpa,
          language: university.requirements.language,
          tests: ['...'] // Hide specific tests
        },
        tuitionFee: 0 // Hide actual fee
      };
      return {
        success: true,
        data: limitedData as University
      };
    }

  return {
    success: true,
    data: university
  };
};

// GET /api/universities/search?q=query - Search universities (public)
export const searchUniversityAPI = async (query: string): Promise<UniversityResponse> => {
  await delay(700);
  const results = searchUniversities(query);
  return {
    success: true,
    data: results
  };
};

// GET /api/universities/country/:country - Get universities by country (public)
export const getUniversitiesByCountryAPI = async (country: string): Promise<UniversityResponse> => {
  await delay(300);
  const results = getUniversitiesByCountry(country);
  return {
    success: true,
    data: results
  };
};

// GET /api/universities/premium - Get premium universities (requires auth)
export const getPremiumUniversitiesAPI = async (): Promise<UniversityResponse> => {
  await delay(300);
  
  if (!isAuthed()) {
    return {
      success: false,
      message: 'Authentication required',
      requiresAuth: true
    };
  }

  const results = getPremiumUniversities();
  return {
    success: true,
    data: results
  };
};

// POST /api/universities/:id/favorite - Add university to favorites (requires auth)
export const addToFavorites = async (universityId: string): Promise<FavoritesResponse> => {
  await delay(400);
  
  if (!isAuthed()) {
    return {
      success: false,
      message: 'Authentication required'
    };
  }

  const user = getUser();
  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  const university = getUniversityById(universityId);
  if (!university) {
    return {
      success: false,
      message: 'University not found'
    };
  }

  // Get current favorites
  const currentFavorites = user.favoriteUniversities || [];
  
  // Add to favorites if not already there
  if (!currentFavorites.includes(universityId)) {
    const updatedFavorites = [...currentFavorites, universityId];
    
    // Update user data
    user.favoriteUniversities = updatedFavorites;
    localStorage.setItem('user', JSON.stringify(user));
    
    return {
      success: true,
      data: updatedFavorites
    };
  }

  return {
    success: true,
    data: currentFavorites
  };
};

// DELETE /api/universities/:id/favorite - Remove university from favorites (requires auth)
export const removeFromFavorites = async (universityId: string): Promise<FavoritesResponse> => {
  await delay(400);
  
  if (!isAuthed()) {
    return {
      success: false,
      message: 'Authentication required'
    };
  }

  const user = getUser();
  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  const currentFavorites = user.favoriteUniversities || [];
  const updatedFavorites = currentFavorites.filter((id: string) => id !== universityId);
  
  // Update user data
  user.favoriteUniversities = updatedFavorites;
  localStorage.setItem('user', JSON.stringify(user));
  
  return {
    success: true,
    data: updatedFavorites
  };
};

// GET /api/universities/favorites - Get user's favorite universities (requires auth)
export const getFavorites = async (): Promise<UniversityResponse> => {
  await delay(500);
  
  if (!isAuthed()) {
    return {
      success: false,
      message: 'Authentication required',
      requiresAuth: true
    };
  }

  const user = getUser();
  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  const favoriteIds = user.favoriteUniversities || [];
  const favoriteUniversities = favoriteIds
    .map((id: string) => getUniversityById(id))
    .filter(Boolean) as University[];

  return {
    success: true,
    data: favoriteUniversities
  };
};

// POST /api/universities/:id/apply - Submit university application (requires auth)
export interface ApplicationData {
  universityId: string;
  program: string;
  personalStatement: string;
  gpa: number;
  testScores: Record<string, number>;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  applicationId?: string;
}

export const submitApplication = async (data: ApplicationData): Promise<ApplicationResponse> => {
  await delay(1200); // Simulate processing time
  
  if (!isAuthed()) {
    return {
      success: false,
      message: 'Authentication required'
    };
  }

  const user = getUser();
  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  const university = getUniversityById(data.universityId);
  if (!university) {
    return {
      success: false,
      message: 'University not found'
    };
  }

  // Generate application ID
  const applicationId = `APP_${Date.now()}_${user.id.slice(-4)}`;
  
  // Store application (in real app, this would go to a database)
  const applications = JSON.parse(localStorage.getItem('applications') || '[]');
  applications.push({
    id: applicationId,
    userId: user.id,
    universityId: data.universityId,
    universityName: university.name,
    program: data.program,
    personalStatement: data.personalStatement,
    gpa: data.gpa,
    testScores: data.testScores,
    status: 'pending',
    submittedAt: new Date().toISOString()
  });
  localStorage.setItem('applications', JSON.stringify(applications));

  return {
    success: true,
    message: 'Application submitted successfully',
    applicationId
  };
};

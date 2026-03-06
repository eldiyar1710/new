import { University, universities, getUniversityById } from '../data/universities';
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

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllUniversities = async (): Promise<UniversityResponse> => {
  await delay(600);
  return {
    success: true,
    data: universities
  };
};

export const getUniversity = async (id: string): Promise<UniversityResponse> => {
  await delay(500);
  const university = getUniversityById(id);
  
  if (!university) {
    return {
      success: false,
      message: 'University not found'
    };
  }

  if (university.isPremium && !isAuthed()) {
    return {
      success: false,
      message: 'Premium content requires authentication',
      requiresAuth: true
    };
  }

  if (!isAuthed()) {
    const limitedData: Partial<University> = {
      ...university,
      programs: university.programs.slice(0, 2),
      requirements: {
        gpa: university.requirements.gpa,
        language: university.requirements.language,
        tests: ['...']
      },
      tuitionFee: 0
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

  const currentFavorites = user.favoriteUniversities || [];
  
  if (!currentFavorites.includes(universityId)) {
    const updatedFavorites = [...currentFavorites, universityId];
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
  
  user.favoriteUniversities = updatedFavorites;
  localStorage.setItem('user', JSON.stringify(user));
  
  return {
    success: true,
    data: updatedFavorites
  };
};

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

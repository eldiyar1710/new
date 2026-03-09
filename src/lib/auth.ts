export interface User {
  id: string;
  name: string;
  email: string;
  contact: string;
  password: string;
  role: "student" | "consultant" | "admin";
  plan: "free" | "basic" | "premium" | "mvp";
  registeredAt: number;
  expiresAt?: number;
  expertId?: string;
  profileCompleted: boolean;
  assessmentCompleted: boolean;
  resultsViewed: boolean;
  referredBy?: string;
  favoriteUniversities?: string[];
}

export const getUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const isAuthed = (): boolean => {
  return !!getUser();
};

export const isConsultant = (): boolean => {
  const user = getUser();
  return user?.role === 'consultant' || user?.role === 'admin';
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'admin';
};

export const isStudent = (): boolean => {
  const user = getUser();
  return user?.role === 'student';
};

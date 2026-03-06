export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "consultant" | "admin";
  plan: "free" | "basic" | "premium";
  registeredAt: number;
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

export const logout = (): void => {
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth-change'));
};

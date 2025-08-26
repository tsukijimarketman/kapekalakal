export interface User {
  id: string;
  role: "user" | "admin" | "delivery";
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signin: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

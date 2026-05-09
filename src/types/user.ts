export type Role = "guest" | "host" | "admin";

export type User = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: Role;
  bio?: string;
  location?: string;
  createdAt: string;
};

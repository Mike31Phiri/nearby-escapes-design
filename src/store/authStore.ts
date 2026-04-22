export type AuthState = { userId?: string; status: "anonymous" | "authenticated" };
export const initialAuthState: AuthState = { status: "anonymous" };

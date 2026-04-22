import { apiRequest } from "./client";

export const getThreads = () => apiRequest("/inbox/threads");

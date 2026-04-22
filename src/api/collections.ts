import { apiRequest } from "./client";

export const getCollections = () => apiRequest("/collections");

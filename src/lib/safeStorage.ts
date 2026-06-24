/**
 * Safe localStorage adapter for zustand persist middleware.
 *
 * Returns `null` instead of empty strings so that the persist
 * middleware's internal JSON.parse never encounters an empty
 * string (which would throw "Unexpected end of JSON input").
 *
 * Usage:
 *   import { createJSONStorage } from "zustand/middleware";
 *   import { safeLocalStorage } from "@/lib/safeStorage";
 *
 *   persist(store, {
 *     name: "my-store",
 *     storage: createJSONStorage(() => safeLocalStorage),
 *   });
 */

import type { StateStorage } from "zustand/middleware";

export const safeLocalStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = localStorage.getItem(name);
      // Return null for empty/falsy strings so zustand's
      // JSON.parse doesn't throw on an empty string.
      if (value === null || value === "" || value === undefined) {
        return null;
      }
      return value;
    } catch {
      // If localStorage is inaccessible (SSR, private browsing, etc.)
      // return null so the store falls back to initial state.
      return null;
    }
  },

  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // Silently ignore quota errors or other storage failures.
    }
  },

  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch {
      // Silently ignore.
    }
  },
};

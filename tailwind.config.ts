// Tailwind v4 is configured via CSS in src/styles.css (@theme).
// This file exists only to satisfy tooling that probes for it.
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
};

export default config;

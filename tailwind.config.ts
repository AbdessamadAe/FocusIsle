import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}", // Ensure all relevant files are included
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

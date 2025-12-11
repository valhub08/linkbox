import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'bg-primary': "var(--bg-primary)",
        'bg-secondary': "var(--bg-secondary)",
        'border-theme': "var(--border-color)",
        'text-primary': "var(--text-primary)",
        'text-secondary': "var(--text-secondary)",
        'text-tertiary': "var(--text-tertiary)",
      },
      backgroundColor: {
        'theme-primary': "var(--bg-primary)",
        'theme-secondary': "var(--bg-secondary)",
      },
      borderColor: {
        'theme': "var(--border-color)",
      },
      textColor: {
        'theme-primary': "var(--text-primary)",
        'theme-secondary': "var(--text-secondary)",
        'theme-tertiary': "var(--text-tertiary)",
      },
    },
  },
  plugins: [],
};
export default config;

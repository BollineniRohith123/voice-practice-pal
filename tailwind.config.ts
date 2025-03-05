import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep purple to lighter lavender gradient
        'deep-purple': '#4B0082', // Deep purple (primary accent)
        'medium-purple': '#8A2BE2', // Medium purple
        'lavender': '#E6E6FA', // Light lavender
        // Neutral/Pastel background
        'neutral-bg': '#F8F0F5', // Light pinkish-gray/off-white
        // Complementary colors
        'soft-blue': '#6495ED', // Soft blue for digital elements
        'salmon': '#FA8072', // Pink/salmon accent for buttons
        'accent-yellow': '#FFD700', // Orange/yellow accent
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-purple": "linear-gradient(to right, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['ReplicaLL'],
        mono: ['ReplicaLLMono'],
      },
    },
  },
  plugins: [],
};
export default config;

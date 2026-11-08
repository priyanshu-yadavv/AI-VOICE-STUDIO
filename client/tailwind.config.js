/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#FAF8F5",       // Soft cream canvas
          card: "#FFFFFF",     // Clean white surface
          subtle: "#F4F1EA",   // Beige neutral background
          muted: "#EAE6DE",    // Soft border & divider
          border: "#E2DDD3",   // Neutral border
          text: "#1F1D1A",     // Deep espresso charcoal
          secondary: "#68645D",// Warm grey body text
          accent: "#C27847",   // Warm terracotta / amber
          accentHover: "#AA6536",
          accentLight: "#FBF3ED",
          accentRing: "rgba(194, 120, 71, 0.25)"
        }
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(28, 25, 23, 0.04), 0 1px 3px 0 rgba(28, 25, 23, 0.02)',
        'card': '0 2px 4px -1px rgba(28, 25, 23, 0.05), 0 4px 12px -2px rgba(28, 25, 23, 0.04)',
        'float': '0 10px 30px -4px rgba(28, 25, 23, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.04)',
      }
    },
  },
  plugins: [],
}

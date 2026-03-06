/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  "#f0f7f2",
          100: "#e0eeE5",
          200: "#c1ddc9",
          300: "#93c4a2",
          400: "#5fa378",
          500: "#3d8059",
          600: "#2d6644",
          700: "#245337",
          800: "#1e422c",
          900: "#1a3624",
        },
        earth: {
          50:  "#fdf8f0",
          100: "#faefd9",
          200: "#f3d9a8",
          300: "#e8bc6e",
          400: "#d99e40",
          500: "#c4852a",
          600: "#a96a1f",
          700: "#8b521c",
          800: "#71421e",
          900: "#5d361c",
        }
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        korean: ["'Noto Serif KR'", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease both",
        "fade-in": "fadeIn 0.4s ease both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

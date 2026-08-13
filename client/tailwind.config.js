/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        approved: "#16a34a",
        attention: "#d97706",
        rejected: "#dc2626",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter"],
        "inter-bold": ["Inter Bold"],
        "inter-black": ["Inter Black"],
        "inter-light": ["Inter Light"],
      },
    },
  },
  plugins: [],
};

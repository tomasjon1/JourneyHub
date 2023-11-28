/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#0D0C22",
        },
        light: {
          400: "#F9F9F9",
          500: "#F8F7F4",
          600: "#E7E7E9",
        },
      },
    },
  },
  plugins: [],
};

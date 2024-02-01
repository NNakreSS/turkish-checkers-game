/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Complex site-specific column configuration
        board: "calc(.25*5rem) , calc(8*5rem)",
      },
    },
  },
  plugins: [],
};

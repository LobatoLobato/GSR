/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { jetbrains: "JetBrains Mono, monospace" },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    plugin(function ({ addComponents }) {
      addComponents({
        ".clickable": {
          cursor: "pointer",
        },
        ".clickable:active": {
          animation: "clickAnimation 0.1s ease",
        },
        "@keyframes clickAnimation": {
          from: {
            cursor: "default",
          },
          to: {
            cursor: "pointer",
          },
        },
      });
    }),
  ],
};

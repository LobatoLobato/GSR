/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: { jetbrains: "JetBrains Mono, monospace" },
      animation: {
        fadeIn: "fadeIn 0.5s ease",
        grow: "grow 1s ease",
        shrinkSideBar: "shrinkSideBar 0.8s ease",
      },
      keyframes: {
        grow: {
          "0%": { width: "0px", padding: "0" },
        },
        shrinkSideBar: {
          "0%": { width: "16.666667%", position: "relative" },
          "60%": {
            position: "relative",
            "padding-left": "0px",
            "padding-right": "0px",
            "padding-bottom": "0px",
            width: "0",
          },
          "70%": {
            position: "absolute",
            "padding-left": "0px",
            "padding-right": "0px",
            "padding-bottom": "0px",
            width: "0",
          },
          "100%": {
            "padding-left": "0",
            "padding-right": "0",
            width: "40px",
            position: "absolute",
          },
        },
        fadeIn: {
          "0%": { opacity: 0 },
        },
      },
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

/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  content: ["./web/**/*.{js,jsx,ts,tsx}", "index.html"],

  theme: {
    extend: {
      fontFamily: { jetbrains: "JetBrains Mono, monospace" },
      animation: {
        fadeIn: "fadeIn 0.5s ease",
        grow: "grow 1s ease",
        shrinkSideBar: "shrinkSideBar 0.8s ease",
        "shrinkSideBar-lg": "shrinkSideBar_lg 0.8s ease",
        "minimize-w": "minimize_w 1s ease",
        "maximize-w": "maximize_w 1s ease",
        "restoreMinimized-w": "restoreMinimized_w 1s ease",
        "restoreMaximized-w": "restoreMaximized_w 1s ease",
        "minimize-h": "minimize_h 1s ease",
        "maximize-h": "maximize_h 1s ease",
        "restoreMinimized-h": "restoreMinimized_h 1s ease",
        "restoreMaximized-h": "restoreMaximized_h 1s ease",
      },
      keyframes: {
        grow: {
          "0%": { width: "0px", padding: "0" },
        },
        shrinkSideBar_lg: {
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
        shrinkSideBar: {
          "0%": { width: "16.666667%" },
          "60%": {
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
        maximize_w: {
          "0%": {
            width: "50%",
          },
          "100%": {
            width: "100%",
          },
        },
        minimize_w: {
          "0%": {
            width: "50%",
          },
          "100%": {
            width: "0%",
          },
        },
        restoreMinimized_w: {
          "0%": {
            width: "0%",
          },
          "100%": {
            width: "50%",
          },
        },
        restoreMaximized_w: {
          "0%": {
            width: "100%",
          },
          "100%": {
            width: "50%",
          },
        },
        maximize_h: {
          "0%": {
            height: "50%",
          },
          "100%": {
            height: "100%",
          },
        },
        minimize_h: {
          "0%": {
            height: "50%",
          },
          "100%": {
            height: "0%",
          },
        },
        restoreMinimized_h: {
          "0%": {
            height: "0%",
          },
          "100%": {
            height: "50%",
          },
        },
        restoreMaximized_h: {
          "0%": {
            height: "100%",
          },
          "100%": {
            height: "50%",
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

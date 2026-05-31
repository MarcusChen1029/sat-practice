import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        serif: ['"Source Serif 4"', '"Source Serif Pro"', "Charter", "Georgia", "serif"],
        sans: ['"Inter Tight"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        paper: {
          DEFAULT: "#f5efe1",
          2: "#ece4d0",
          3: "#e0d6bd",
        },
        ink: {
          DEFAULT: "#1c1a16",
          2: "#4a463c",
          3: "#8b8676",
        },
        rule: "#c9bfa8",
        oxblood: {
          DEFAULT: "#7a1f1f",
          2: "#5d1717",
        },
        terracotta: "#c44536",
        olive: {
          DEFAULT: "#5a6b3b",
          2: "#43522a",
        },
        marigold: "#d99a2b",
        highlight: "#efd56a",
      },
    },
  },
  plugins: [],
};
export default config;

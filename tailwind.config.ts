import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      colors: {
        "crypto-dark": "#080a0e",
        "crypto-darker": "#050608",
        "crypto-card": "#0d1117",
        "crypto-border": "#1a2035",
        "bitcoin-orange": "#f7931a",
        "bitcoin-orange-dark": "#d4780f",
        "neon-green": "#00ff88",
        "neon-cyan": "#00d4ff",
        "neon-pink": "#ff2d7e",
        "neon-purple": "#b44fff",
      },
      fontFamily: {
        mono: ["'Courier New'", "Courier", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(247,147,26,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(247,147,26,0.05) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-orange": "glow-orange 2s ease-in-out infinite alternate",
        "glow-green": "glow-green 2s ease-in-out infinite alternate",
        "glow-pink": "glow-pink 2s ease-in-out infinite alternate",
        "glow-cyan": "glow-cyan 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        ticker: "ticker 20s linear infinite",
      },
      keyframes: {
        "glow-orange": {
          from: { textShadow: "0 0 10px #f7931a, 0 0 20px #f7931a" },
          to: { textShadow: "0 0 20px #f7931a, 0 0 40px #f7931a, 0 0 60px #f7931a" },
        },
        "glow-green": {
          from: { textShadow: "0 0 10px #00ff88, 0 0 20px #00ff88" },
          to: { textShadow: "0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 60px #00ff88" },
        },
        "glow-pink": {
          from: { textShadow: "0 0 10px #ff2d7e, 0 0 20px #ff2d7e" },
          to: { textShadow: "0 0 20px #ff2d7e, 0 0 40px #ff2d7e, 0 0 60px #ff2d7e" },
        },
        "glow-cyan": {
          from: { textShadow: "0 0 10px #00d4ff, 0 0 20px #00d4ff" },
          to: { textShadow: "0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 60px #00d4ff" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        ticker: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      boxShadow: {
        "glow-orange": "0 0 20px rgba(247,147,26,0.4), 0 0 40px rgba(247,147,26,0.2)",
        "glow-green": "0 0 20px rgba(0,255,136,0.4), 0 0 40px rgba(0,255,136,0.2)",
        "glow-pink": "0 0 20px rgba(255,45,126,0.4), 0 0 40px rgba(255,45,126,0.2)",
        "glow-cyan": "0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(0,212,255,0.2)",
        "card-glow": "0 4px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
    },
  },

  plugins: [],
} as Config;

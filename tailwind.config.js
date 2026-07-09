/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "brand-olive": "#7C8A5C",
        "brand-cream": "#F8F3E9",
        "brand-red": "#3F5233",
        "brand-ink": "#2B2620",
        "brand-gold": "#C9973A",
        "brand-sand": "#EDE4D3"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        script: ["var(--font-script)", "cursive"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 16px 40px rgba(43, 38, 32, 0.12)"
      }
    }
  },
  plugins: []
};

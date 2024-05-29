import tailwindcss from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  plugins: [require("tailwindcss")("tailwind.js"), require("autoprefixer")()],
};

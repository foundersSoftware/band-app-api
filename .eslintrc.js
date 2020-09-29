module.exports = {
  extends: ["airbnb-typescript/base"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "@typescript-eslint/quotes": ["error", "double"],
  },
};

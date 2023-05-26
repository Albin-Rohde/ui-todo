module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parser: "@typescript-eslint/parser",
  overrides: [],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json"
  },
  plugins: [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  ignorePatterns: [
    "tsconfig.json",
    "node_modules/",
    "dist/",
    "jest.config.js",
    ".eslintrc.js",
    "src/migrations/*.ts"
  ],
  rules: {
    quotes: ["error", "double"]
  }
}

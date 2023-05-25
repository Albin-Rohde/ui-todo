module.exports = {
  parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends: [
    'plugin:react/recommended',  // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parserOptions: {
    ecmaVersion: 2020,  // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',  // Allows for the use of imports
    ecmaFeatures: {
      jsx: true,  // Allows for the parsing of JSX
    },
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-double'],
    'react/react-in-jsx-scope': 'off',
    'import/order': ['error', {
      'newlines-between': 'always',
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
    }],
  },
  settings: {
    react: {
      version: 'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
};

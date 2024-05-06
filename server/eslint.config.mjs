// eslint.config.js
import globals from "globals";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";

const compat = new FlatCompat({
  baseDirectory: new URL('.', import.meta.url).pathname,
  recommendedConfig: pluginJs.configs.recommended
});

export default [
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2021,
      sourceType: "module"
    },
    settings: {
      'import/ignore': ['node_modules/react-native/index\\.js$']
    },
    rules: {
      "import/extensions": [
        "error",
        "always",
        {
          "js": "never"
        }
      ]
    }
  },
  ...compat.extends("airbnb-base"),
];
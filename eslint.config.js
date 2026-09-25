const js = require("@eslint/js");

module.exports = [
  {
    files: ["eslint.config.js"],
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly"
      }
    }
  },

  js.configs.recommended,

  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        process: "readonly",
        console: "readonly"
      }
    }
  },

  {
    files: ["test/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly"
      }
    }
  },

  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**"
    ]
  }
];

// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "max-len": [
        "error",
        {
          code: 120,
          ignorePattern: "[^imports|^exports]",
        },
      ],
      "no-alert": "error",
      "no-console": "error",
      "no-debugger": "error",
      "no-array-constructor": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/member-ordering": ["error", { classes: ["field", "constructor", "method"] }],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "am",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "am",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "no-public",
        },
      ],
      "@typescript-eslint/no-param-reassign": "off",
      "@typescript-eslint/no-require-imports": "error",
      "newline-before-return": "error",
      "arrow-parens": ["off", "always"],
      "comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
          functions: "always-multiline",
        },
      ],
      eqeqeq: ["error", "always"],
      "linebreak-style": ["error", "unix"],
      "max-classes-per-file": ["error", 1],
      "max-lines": ["error", 600],
      "no-duplicate-imports": "error",
      "no-irregular-whitespace": "error",
      "no-multiple-empty-lines": "error",
      // Evitar funciones muy largas
      "max-lines-per-function": [
        "error",
        {
          max: 50,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      // Complejidad ciclomática
      complexity: ["error", { max: 10 }],

      // Profundidad máxima de anidación
      "max-depth": ["error", 3],

      // Argumentos máximos en funciones
      // "max-params": ["error", 3],
      "no-plusplus": [
        "error",
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      "no-redeclare": "error",
      "no-useless-constructor": "off",
      "space-before-function-paren": ["error", "never"],
      "no-inline-comments": "error",
      "no-constructor-return": "error",
      "no-self-compare": "error",
      "no-unused-private-class-members": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      camelcase: "error",
      curly: "error",
      "lines-between-class-members": [
        "error",
        {
          enforce: [{ blankLine: "always", prev: "method", next: "method" }],
        },
      ],
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "block-like",
          next: "*",
        },
        {
          blankLine: "always",
          prev: "*",
          next: "block-like",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "*.config.*", // Ignore all config files
    ],
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"], // Only apply custom rules to source files
    rules: {
      // Enforce 2-space indentation
      "indent": ["error", 2, {
        "SwitchCase": 1,
        "VariableDeclarator": 1,
        "outerIIFEBody": 1,
        "MemberExpression": 1,
        "FunctionDeclaration": { "parameters": 1, "body": 1 },
        "FunctionExpression": { "parameters": 1, "body": 1 },
        "CallExpression": { "arguments": 1 },
        "ArrayExpression": 1,
        "ObjectExpression": 1,
        "ImportDeclaration": 1,
        "flatTernaryExpressions": false,
        "ignoreComments": false,
        "ignoredNodes": ["TemplateLiteral *", "JSXElement", "JSXElement > *", "JSXAttribute", "JSXIdentifier", "JSXNamespacedName", "JSXMemberExpression", "JSXSpreadAttribute", "JSXExpressionContainer", "JSXOpeningElement", "JSXClosingElement", "JSXFragment", "JSXOpeningFragment", "JSXClosingFragment", "JSXText", "JSXEmptyExpression", "JSXSpreadChild"],
        "offsetTernaryExpressions": true
      }],
      // Align object properties (key-spacing) - only for object literals in source code
      "key-spacing": ["error", {
        "align": {
          "beforeColon": false,
          "afterColon": true,
          "on": "colon"
        }
      }],
      // Ensure consistent object property alignment
      "no-multi-spaces": ["error", {
        "exceptions": {
          "Property": true,
          "VariableDeclarator": true,
          "ImportDeclaration": true
        }
      }]
    }
  }
];

export default eslintConfig;

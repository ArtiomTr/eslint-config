const { accessSync } = require('fs');
const { resolve } = require('path');

let isTsconfigAvailable;
const tsConfigPath = resolve(process.cwd(), 'tsconfig.json');

try {
    accessSync(tsConfigPath);
    isTsconfigAvailable = true;
} catch {
    isTsconfigAvailable = false;
}

/** @type {import('eslint').Linter.Config} */
module.exports = {
    // Using Typescript parser, because it works both with JavaScript and TypeScript files.
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // Some rules from @typescript-eslint plugin require project (tsconfig.json file).
        // However, it will throw an error if no such file exist. So this code checks, if
        //   tsconfig exists, and if not, disables some rules.
        project: isTsconfigAvailable ? tsConfigPath : undefined,
    },
    plugins: [
        // Plugin to glue Prettier and ESLint together.
        'prettier',
        // Useful rules when working with TypeScript.
        '@typescript-eslint',
        // Rules for package.json workspaces
        'workspaces',
        // Lodash-specific rules, to do some optimizations
        'lodash',
        // Some great ESLint rules from xo (https://github.com/xojs/xo)
        'unicorn',
        // Plugin for sorting imports
        'import',
    ],
    extends: [
        // Recommended ESLint code style.
        'eslint:recommended',
        // Prettier plugin recommended configuration, which disables conflicting rules from ESLint.
        'plugin:prettier/recommended',
        // Recommended configuration for TypeScript
        'plugin:@typescript-eslint/recommended',
        // Great defaults from xo
        'plugin:unicorn/recommended',
    ],
    // Rules that are default for all source files.
    rules: {
        'prettier/prettier': [
            'error',
            // Default Prettier code style, to ensure same code style across all projects.
            {
                // Disables annoying issue, when people with Windows and Linux environments are working
                //   on same project. Linux has only LF at the end of line, while Windows has CRLF. This
                //   results in dirty git history. In my opinion, best strategy is to turn off "core.autocrlf"
                //   on Windows and commit "as is".
                endOfLine: 'auto',
                tabWidth: 4,
                printWidth: 120,
                trailingComma: 'all',
                singleQuote: true,
                useTabs: false,
                arrowParens: 'always',
                bracketSameLine: false,
                bracketSpacing: true,
                embeddedLanguageFormatting: 'auto',
                jsxSingleQuote: false,
            },
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                // All variables by default should be camelCased.
                selector: ['variableLike', 'memberLike', 'property', 'method'],
                format: ['camelCase'],
                // Leading underscore is allowed for ignored parameters.
                leadingUnderscore: 'allow',
                trailingUnderscore: 'forbid',
            },
            {
                // Global constants should be UPPER_CASED.
                selector: 'variable',
                modifiers: ['const'],
                format: ['camelCase', 'UPPER_CASE'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                // All types, classes, enums should be in PascalCase.
                selector: 'typeLike',
                format: ['PascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                // Enum members in UPPER_CASE.
                selector: 'enumMember',
                format: ['UPPER_CASE'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
        ],
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        'array-callback-return': ['error', { checkForEach: true, allowImplicit: false }],
        'capitalized-comments': 'warn',
        curly: ['error', 'all'],
        // Ensure consistent import ordering.
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type', 'object'],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        // Lodash optimization.
        'lodash/import-scope': ['error', 'method'],
        // Workspace configurations.
        'workspaces/no-relative-imports': 'error',
        'workspaces/no-absolute-imports': 'error',
        'workspaces/require-dependency': 'error',
        // Disallow regular expressions with exponential time complexity.
        'unicorn/no-unsafe-regex': 'error',
        'unicorn/filename-case': 'off',
        'unicorn/prefer-ternary': 'off',
        'unicorn/no-array-callback-reference': 'off',
    },
    overrides: [
        {
            files: '**/*.config.js',
            env: {
                node: true,
            },
            rules: {
                'unicorn/prevent-abbreviations': 'off',
                'unicorn/prefer-module': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                'no-console': 'off',
            },
        },
        {
            files: '**/*.{tsx,jsx}',
            extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:react/jsx-runtime'],
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            settings: {
                react: {
                    version: 'detect',
                },
            },
            env: {
                browser: true,
            },
            rules: {
                '@typescript-eslint/naming-convention': [
                    'error',
                    ...(isTsconfigAvailable
                        ? [
                              {
                                  selector: ['variable'],
                                  types: ['function'],
                                  format: ['camelCase', 'PascalCase'],
                                  leadingUnderscore: 'allow',
                                  trailingUnderscore: 'forbid',
                              },
                              {
                                  selector: ['variable', 'property', 'parameter'],
                                  format: ['camelCase', 'PascalCase'],
                                  filter: {
                                      regex: '^\\w+Component$',
                                      match: true,
                                  },
                                  leadingUnderscore: 'allow',
                                  trailingUnderscore: 'forbid',
                              },
                              {
                                  selector: ['variable', 'property', 'parameter'],
                                  format: ['camelCase', 'PascalCase'],
                                  filter: {
                                      regex: '^\\w+Context$',
                                      match: true,
                                  },
                                  leadingUnderscore: 'allow',
                                  trailingUnderscore: 'forbid',
                              },
                          ]
                        : [
                              {
                                  selector: ['variable', 'property', 'parameter'],
                                  format: ['camelCase', 'PascalCase'],
                                  leadingUnderscore: 'allow',
                                  trailingUnderscore: 'forbid',
                              },
                          ]),
                    {
                        selector: ['variableLike', 'memberLike', 'property', 'method'],
                        format: ['camelCase'],
                        leadingUnderscore: 'allow',
                        trailingUnderscore: 'forbid',
                    },
                    {
                        selector: 'variable',
                        modifiers: ['const'],
                        format: ['camelCase', 'UPPER_CASE'],
                        leadingUnderscore: 'forbid',
                        trailingUnderscore: 'forbid',
                    },
                    {
                        selector: 'typeLike',
                        format: ['PascalCase'],
                        leadingUnderscore: 'forbid',
                        trailingUnderscore: 'forbid',
                    },
                    {
                        selector: 'enumMember',
                        format: ['UPPER_CASE'],
                        leadingUnderscore: 'forbid',
                        trailingUnderscore: 'forbid',
                    },
                ].filter(Boolean),
                'no-console': 'error',
                'react/prop-types': 'off',
                'react/display-name': 'off',
                'react-hooks/exhaustive-deps': 'error',
                '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: 'React' }],
                'unicorn/prevent-abbreviations': [
                    'error',
                    {
                        replacements: {
                            props: {
                                properties: false,
                            },
                        },
                    },
                ],
            },
        },
    ],
};

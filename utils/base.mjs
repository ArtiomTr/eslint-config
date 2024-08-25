import prettier from 'eslint-plugin-prettier';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import workspaces from 'eslint-plugin-workspaces';
import lodash from 'eslint-plugin-lodash';
import unicorn from 'eslint-plugin-unicorn';
import _import from 'eslint-plugin-import';
import { fixupPluginRules, fixupConfigRules } from '@eslint/compat';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { createSyncFn } from 'synckit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const initPrettier = createSyncFn(fileURLToPath(new URL('./worker.js', import.meta.url)));

const prettierConfig = initPrettier();

export default [
    ...compat.extends(
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:unicorn/recommended',
    ),
    {
        plugins: {
            prettier,
            '@typescript-eslint': typescriptEslint,
            workspaces,
            lodash,
            unicorn,
            import: fixupPluginRules(_import),
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },

        rules: {
            'prettier/prettier': [
                'escalate',
                prettierConfig,
            ],

            'unicorn/no-useless-undefined': 'off',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': 'escalate',
            '@typescript-eslint/no-empty-function': 'escalate',

            'array-callback-return': [
                'error',
                {
                    checkForEach: true,
                    allowImplicit: false,
                },
            ],

            'capitalized-comments': 'off',
            curly: ['escalate', 'all'],

            'import/order': [
                'escalate',
                {
                    groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type', 'object'],

                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],

            'lodash/import-scope': ['escalate', 'method'],
            'workspaces/no-relative-imports': 'escalate',
            'workspaces/no-absolute-imports': 'escalate',
            'workspaces/require-dependency': 'escalate',
            'unicorn/no-unsafe-regex': 'error',
            'unicorn/filename-case': 'off',
            'unicorn/prefer-ternary': 'off',
            'unicorn/no-array-callback-reference': 'off',
            'unicorn/expiring-todo-comments': 'off',
        },
    },
    {
        files: ['**/*.config.{js,cjs,mjs}'],

        languageOptions: {
            globals: {
                ...globals.node,
            },
        },

        rules: {
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/prefer-module': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            'no-console': 'off',
        },
    },
    ...fixupConfigRules(
        compat.extends('plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:react/jsx-runtime'),
    ).map((config) => ({
        ...config,
        files: ['**/*.{tsx,jsx}'],
    })),
    {
        files: ['**/*.{tsx,jsx}'],

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            ecmaVersion: 5,
            sourceType: 'script',

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        settings: {
            react: {
                version: 'detect',
            },
        },

        rules: {
            'no-console': 'escalate',
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react-hooks/exhaustive-deps': 'escalate',

            '@typescript-eslint/no-unused-vars': [
                'escalate',
                {
                    varsIgnorePattern: 'React',
                },
            ],

            'unicorn/prevent-abbreviations': [
                'escalate',
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
];

import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
    // 1. Ignore
    {
        ignores: ['**/eslint.config.mjs', 'dist/', 'build/', 'node_modules/'],
    },

    // 3. TypeScript + imports + prettier — all in one block
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            import: importPlugin,
            'simple-import-sort': simpleImportSort,
            prettier: prettierPlugin,
        },
        settings: {
            'import/resolver': {
                'typescript': true, // ← uses eslint-import-resolver-typescript
            },
        },
        rules: {
            // --- TypeScript ---
            ...tseslint.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',

            // --- Imports ---
            'import/no-cycle': ['error', { maxDepth: Infinity, ignoreExternal: true }],
            'import/no-self-import': 'error',
            'simple-import-sort/imports': 'error',
            'import/no-unresolved': 'error',
            'simple-import-sort/exports': 'error',
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',

            // --- Prettier ---
            'prettier/prettier': ['error', { semi: false }],
        },
    },

    // 4. Specific configuration for nestia-api
    {
        files: ['**/nestia-api/**/*.ts'],
        rules: {
            '@typescript-eslint/no-namespace': 'off',
        },
    },
];
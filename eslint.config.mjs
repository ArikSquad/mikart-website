import nextPlugin from '@next/eslint-plugin-next'
import nextParser from 'eslint-config-next/parser'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
    {
        files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            },
            parser: nextParser,
            parserOptions: {
                allowImportExportEverywhere: true,
                babelOptions: {
                    caller: {
                        supportsTopLevelAwait: true
                    },
                    presets: ['next/babel']
                },
                requireConfigFile: false,
                sourceType: 'module'
            }
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'off'
        },
        plugins: {
            '@next/next': nextPlugin,
            'react-hooks': reactHooks
        },
        rules: {
            '@next/next/no-html-link-for-pages': 'off',
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
            'react-hooks/exhaustive-deps': 'warn',
            'react-hooks/rules-of-hooks': 'error'
        },
        settings: {
            next: { rootDir: true }
        }
    },
    {
        ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts']
    }
]

import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'

export default [
  js.configs.recommended,
  {
    ignores: [
      'src/components/generators/*',
      'src/components/editors/*',
      'src/components/previews/*',
      'src/components/ui/*',
      'src/app/layout.tsx',
      'src/components/hero-header.tsx'
    ],
    plugins: {
      '@next/next': nextPlugin
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'react/no-unescaped-entities': 'off',
      'prefer-const': 'off'
    }
  }
] 
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'Циклические зависимости могут вызвать проблемы с инициализацией модулей и DI в NestJS',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-circular-via-barrel',
      severity: 'warn',
      comment:
        'Импорт через barrel-файлы (index.ts) может скрывать циклические зависимости',
      from: {},
      to: {
        path: 'index\\.(ts|js)$',
        circular: true,
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    exclude: {
      path: [
        'prisma/generated',
        'node_modules',
        'dist',
        'build',
      ],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: './tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+',
      },
      text: {
        highlightFocused: true,
      },
    },
  },
}
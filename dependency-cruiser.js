/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'Circular dependencies can cause problems with module initialization and DI in NestJS',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-circular-via-barrel',
      severity: 'warn',
      comment:
        'Import through barrel files (index.ts) can hide circular dependencies',
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
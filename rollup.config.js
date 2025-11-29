import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.js', format: 'cjs' },
      { file: 'dist/index.esm.js', format: 'es' }
    ],
    plugins: [typescript({ include: ['src/**/*'] })]
  },
  {
    input: 'src/index.ts',
    output: { file: 'dist/index.umd.js', format: 'umd', name: 'ArmorEditor' },
    plugins: [typescript({ include: ['src/**/*'] })]
  }
];

import coreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...coreWebVitals,
  {
    ignores: [
      'src/spacetime/**',
      'storybook-static/**',
      'test-results/**'
    ],
  },
];

export default config;

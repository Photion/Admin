/* eslint-disable */
const getConfig = (type, color = 'blue', coverage = false) => {
  const config = {
    testEnvironment: 'jsdom',
    displayName: {
      name: type.toUpperCase(),
      color,
    },
    moduleNameMapper: {
      '~/(.*)$': '<rootDir>/$1',
    },
    setupFiles: [
      '<rootDir>/tests/setup.ts',
    ],
    testMatch: [
      `<rootDir>/tests/${type}/**/*.test.ts`,
    ],
    transform: {
      "^.+\\.vue$": "vue-jest",
      "^.+\\.ts$": "babel-jest"
    },
  };

  return config;
};


const jestConfig = {
  projects: [
    getConfig('unit', 'cyan', Boolean(process.env.COVERAGE)),
    getConfig('feat', 'magentaBright', Boolean(process.env.COVERAGE)),
  ],
}

if (process.env.COVERAGE) {
  jestConfig.collectCoverage = true;
  jestConfig.collectCoverageFrom = [
    '<rootDir>/src/**/*.ts'
  ];
}

module.exports = jestConfig;

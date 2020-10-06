/** Required by SFC */
const VUE_CLI_BABEL_PRESET = '@vue/cli-plugin-babel/preset';

/** Required by Jest */
const JEST_BABEL_PRESET =     ['@babel/preset-env', { targets: { node: 'current' } } ];

/** Required by Jest to run TS file */
const JEST_TYPESCRIPT_PRESET = '@babel/preset-typescript';

/**
 * Config to be used while running
 * the Vue-based codebase.
 */
const vueConfig = {
  presets: [
    VUE_CLI_BABEL_PRESET,
    JEST_BABEL_PRESET,
    JEST_TYPESCRIPT_PRESET,
  ],
};

/**
 * Cypress doesn't need any
 * of the babel plugins defined above.
 * In fact, it breaks with them.
 */
const cypressConfig = {};

/**
 * Checks whether Cypress is running
 * and pass the appropriate babel config
 * to the environment.
 */
const babelConfig = process.env.CYPRESS_ENV ? cypressConfig : vueConfig;

module.exports = babelConfig;

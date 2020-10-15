/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');


const releaseId = process.env.PHOTION_RELEASE_ID || process.env.GITHUB_SHA || 'dev';

const vueConfig = {

  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      },
    },
    plugins: [],
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('~', __dirname);
    config.resolve.alias.set('%', path.resolve(__dirname, 'src/vue/components'));
    config.output.chunkFilename('js/[name].[id].[chunkhash:8].js');
  },
};

if (process.env.SENTRY_UPLOAD_SOURCE_MAPS) {
  const sentryPlugin = new SentryWebpackPlugin({
    authToken: process.env.SENTRY_AUTH_TOKEN,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    include: './dist',
    ignore: ['node_modules'],
    release: `photion.web-admin@${releaseId}`,
  });

  vueConfig.configureWebpack.plugins.push(sentryPlugin);
}

module.exports = vueConfig;

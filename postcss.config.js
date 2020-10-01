// eslint-disable-next-line @typescript-eslint/no-var-requires
const tailwindcss = require('tailwindcss');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const autoprefixer = require('autoprefixer');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const postcssPurgecss = require('@fullhuman/postcss-purgecss');

const IN_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
    IN_PRODUCTION && postcssPurgecss({
      content: [ './public/**/*.html', './src/**/*.vue' ],
      defaultExtractor: (content) => {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '');
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
      },
      whitelistPatterns: [ /-(leave|enter|appear)(|-(to|from|active))$/, /^(?!cursor-move).+-move$/, /^router-link(|-exact)-active$/ ],
    }),
  ],
};
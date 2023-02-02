const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './static/datepick.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /locale/],
        use:
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(d.ts)$/,
        use: [
          {
            loader: 'null-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new TerserPlugin(),
  ],
  mode: 'production',
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    poll: 3000,
    aggregateTimeout: 2000,
  },
};

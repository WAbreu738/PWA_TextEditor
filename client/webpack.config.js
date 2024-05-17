const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const plugins = [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),

    new WebpackPwaManifest({
      fingerprints: false,
      inject: true,
      name: 'Just Another Text Editor',
      short_name: 'JATE',
      description: 'Another Text Editor',
      background_color: '#ffffff',
      theme_color: '#31a9e1',
      publicPath: '/',
      icons: [
        {
          src: path.resolve('./src/images/logo.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join('assets', 'icons'),
        },
      ],
    }),
  ];

  if (isProduction) {
    plugins.push(
      new InjectManifest({
        swSrc: './src-sw.js',
      })
    );
  }

  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'output'),
    },
    plugins: plugins,
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/transform-runtime',
              ],
            },
          },
        },
      ],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, './output'),
      },
      compress: true,
      port: 8080,
      watchFiles: {
        paths: ['./src/**/*'],
        options: {
          ignored: /node_modules/,
          aggregateTimeout: 300,
          poll: 1000,
        },
      },
    },
  };
};
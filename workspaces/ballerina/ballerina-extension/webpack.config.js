//@ts-check

'use strict';

const path = require('path');
const webpack = require('webpack');
const MergeIntoSingleFile = require('webpack-merge-and-include-globally');

/** @type {import('webpack').Configuration} */
module.exports = [{
  watch: false,
  target: 'node',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: {
    keytar: "commonjs keytar",
    vscode: 'commonjs vscode',
    bufferutil: 'commonjs bufferutil',
    'utf-8-validate': 'commonjs utf-8-validate'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              logLevel: "info"
            }
          }
        ]
      }
    ]
  },
  stats: 'normal',
  plugins: [
    new MergeIntoSingleFile({
      files: {
        [path.join('..', 'resources', 'jslibs', 'webviewCommons.js')]: [
          path.resolve('resources', 'utils', 'undo-redo.js'),
          path.resolve('node_modules', 'pako', 'dist', 'pako.min.js'),
        ],
      },
      transform: {
        'webviewCommons.js': code => require("uglify-js").minify(code).code
      }
    })
  ]
},
//web build configuration
{
  watch: false,
  target: 'webworker', // Web target,
  mode: 'none',
  entry: {
    'extension': './src/extension.ts'
  }, // Same entry point for both desktop and web
  output: {
    path: path.resolve(__dirname, 'dist/web'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  devtool: 'source-map',

  externals: {
    vscode: 'commonjs vscode' ,
    'applicationinsights-native-metrics': 'commonjs applicationinsights-native-metrics',

  },

  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1 // disable chunks by default since web extensions must be a single bundle
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  ],
  resolve: {
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.ts', '.js'],
    fallback: {
      os: require.resolve('os-browserify/browser'),
      module: false,
      console: false,
      stream: require.resolve('stream-browserify'),
      fs: false,
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      zlib: require.resolve('browserify-zlib'),
      net: false,
      path: require.resolve('path-browserify'),
      util: require.resolve('util/'),
      child_process: false,
      url: require.resolve('url/'),
      assert: require.resolve('assert/'),
      process: require.resolve('process/browser'), // Add process polyfill,
      buffer: require.resolve('buffer/'),
      vm: false,
      constants: require.resolve("constants-browserify"),
      timers: require.resolve("timers-browserify"),
      dns: false,
      _stream_transform: false,
      async_hooks: false
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
        
      },
    ],
  },
},
{
  mode: 'none',
  target: 'webworker', // web extensions run in a webworker context
  entry: {
    browserServerMain: './src/web-activators/Ls/browserServerMain.ts',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'serverExportVar',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  resolve: {
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.js'], // support ts-files and js-files
    alias: {},
    fallback: {
      //path: require.resolve("path-browserify")
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  externals: {
    vscode: 'commonjs vscode', // ignored because it doesn't exist
    'async_hooks': 'commonjs async_hooks',
    'cls-hooked': 'commonjs cls-hooked',
    'applicationinsights-native-metrics': 'commonjs applicationinsights-native-metrics',

  },
  performance: {
    hints: false,
  },
  devtool: 'nosources-source-map',
}
];

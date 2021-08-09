const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  resolve: {
    fallback: {
      "fs": false,
      "path": false,
      "stream": false,
      "vm": false,
      "http": false,
      "https": false,
      "timers": false,
      "string_decoder": false
    }
  },
  entry: {
    'app': '/app/app.js',
    'execute': '/app/executer/execute.js'
},
  output: {
    path: __dirname + '/public',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.bpmn$/,
        use: 'raw-loader'
      },
      {
        test: /\.svg$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets/**', to: 'vendor/bpmn-js', context: 'node_modules/bpmn-js/dist/' },
        { from: '**/*.{html,css}', context: 'app/' },
        { from: '**/*.{html,css}', context: 'app/executer' },
        { from: '**/svg/*.svg', to: '.', context: 'app/' },
        { from: 'node_modules/bpmn-js-properties-panel/dist/assets', to: 'vendor/bpmn-js-properties-panel/assets' },
      ]
    })
  ],
  mode: 'development',
  devtool: 'source-map'
};

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "vm": require.resolve("vm-browserify"),
      "timers": require.resolve("timers-browserify")
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
        { from: 'node_modules/bpmn-js-properties-panel/dist/assets', to: 'vendor/bpmn-js-properties-panel/assets' }
      ]
    })
  ],
  mode: 'development',
  devtool: 'source-map'
};

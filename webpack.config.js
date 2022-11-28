const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify")
    }
  },
  entry: {
    'app': '/app/app.js'
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
        { from: 'svg/**/!(*.js)', to: '.', context: 'app/' },
        { from: 'node_modules/bpmn-js-properties-panel/dist/assets', to: 'vendor/bpmn-js-properties-panel/assets' },
        { from: 'css/bootstrap.css', to: 'vendor/bootstrap/', context: 'node_modules/bootstrap/dist/' },
        { from: 'js/bootstrap.bundle.js', to: 'vendor/bootstrap/', context: 'node_modules/bootstrap/dist/' }
      ]
    })
  ],
  mode: 'development',
  devtool: 'source-map'
};

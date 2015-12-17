module.exports = {
  output: {
    library: 'bottle',
    libraryTarget: 'umd',
    path: './dist',
    filename: 'hydrate-app.js'
  },
  entry: {
    library: './src/main.js'
  }
}

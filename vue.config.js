module.exports = {
  lintOnSave: false,
  outputDir: "back-end/public",
  devServer: {
    proxy: "http://localhost:8090"
  }
};

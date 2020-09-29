module.exports = {
  devServer : {
    proxy : process.env.BACKEND_URI || 'http://localhost:3000'
  }
}
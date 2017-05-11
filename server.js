var express = require('express')
var webpack = require('webpack')
var WebpackDevMiddleware = require('webpack-dev-middleware')
var WebpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.dev.config')
var compiler = webpack(config)
var port = 8980;

app = express();

app.use(WebpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  noInfo: true,
  hot: true,
  historyApiFallback: true, 
  inline: true
}))

app.use(WebpackHotMiddleware(compiler))

app.use(express.static('build'));

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
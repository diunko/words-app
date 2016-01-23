
//var express = require('express');

var fs = require('fs')

var webpack = require('webpack');

var debug = require('debug')('words:stats')

//var webpackMiddleware = require('webpack-dev-middleware')

var WebpackDevServer = require('webpack-dev-server');

var config = require('./webpack.config');


//var app = express()

var port = process.env.npm_package_config_port || 3000;

var webpackServer = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true
})

// var wm = webpackMiddleware(webpack(config), {
//   publicPath: config.output.publicPath,
//   hot: true
// })

// app.use(wm)

var share=require('share')

console.log("ShareJS example server v" + share.version);

share.server.attach(webpackServer.app, {
  db:{type:'none'},
  browserChannel: {cors:'*'}
})



webpackServer.listen(port, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:' + port);
});


setTimeout(function(){
  var cli = share.client

  debug('opening stats doc')
  
  cli.open('stats', 'json', 'http://localhost:3000/channel', function(error, doc){

    debug('doc opened', error, doc)
    
    doc.on('change', function(ops){

      ops.forEach(function(op){

        debug('op', op)

        debug('typeof op.oi, op.oi', typeof op.oi, op.oi)

        if(op.oi && typeof op.oi === 'object'){

          debug('merging stats', op.oi)

          try {
            var db = JSON.parse(fs.readFileSync('./stats.json', {encoding: 'utf8'}))
          } catch (e){
            var db = {}
          }
          debug('read db', db)
          
          Object.keys(op.oi).some(function(k){
            if(k in db){
              db[k].push(op.oi[k])
            } else {
              db[k] = [op.oi[k]]
            }
          })

          try {
            var data = JSON.stringify(db, null, 2)
            fs.writeFileSync('./stats.json', data)
            fs.writeFileSync('./js/stats.js', 'module.exports = ' + data)
          } catch (e){
            // ignore
          }

          debug(db)
        }

      })
    })
    
  })
}, 1000)



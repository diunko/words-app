
var Morearty = require('morearty');
var React = window.React = require('react/addons');
var Router = require('director').Router;
var Immutable = require('immutable');

var words = require("./words")
var Word = words.Word
var EatenWord = words.EatenWord

var WordsInput = require("./wordsinput").WordsInput


var Ctx = Morearty.createContext({
  initialState: {
    eaten: [],
    words: [],
    cursor: {
      idx: 0,
      eaten: '',
      left: '',
      value: '',
      body:0
    }
  }
});

var $state
var $stats


var wwb = Ctx.getBinding().sub('words')
var eeb = Ctx.getBinding().sub('eaten')
var ccb = Ctx.getBinding().sub('cursor')

function stateUpdate(op){
  if(op){
    console.log('docop', JSON.stringify(op))
    op.forEach(function(o){
      console.log('op', o)
      var p = o.p
      if(p.length === 0){
        if (o.oi.words && o.oi.eaten && (o.od === null || (o.od.words && o.od.eaten))){
          wwb.update(function(ww0){
            return Immutable.List(o.oi.words)
          })
          eeb.update(function(ww0){
            return Immutable.List(o.oi.eaten)
          })
          ccb.update(function(c){
            return Immutable.Map({
              idx:0,
              eaten:'',
              left:'',
              value:'',
              body:0
            })
          })
        }
      } else if(p.length === 2 && p[0] === 'words' && typeof p[1] === 'number'){
        console.log('words op', JSON.stringify(o))
        console.log('cursor', JSON.stringify(ccb.get().toJS()))
        if('li' in o && 'ld' in o){
          wwb.update(function(ww0){
            return ww0.splice(p[1],1,o.li)
          })
        } else if('li' in o && !('ld' in o)){
          wwb.update(function(ww0){
            return ww0.splice(p[1],0,o.li)
          })
        } else if(!('li' in o) && 'ld' in o){
          wwb.update(function(ww0){
            return ww0.splice(p[1],1)
          })
        } else {
          console.log('bad match, reject op')
        }
      } else if(p.length === 2 && p[0] === 'eaten' && typeof p[1] === 'number'){
        console.log('eaten op', JSON.stringify(o))
        if('li' in o && 'ld' in o){
          eeb.update(function(ww0){
            return ww0.splice(p[1],1,o.li)
          })
        } else if('li' in o && !('ld' in o)){
          eeb.update(function(ww0){
            return ww0.splice(p[1],0,o.li)
          })
        } else if(!('li' in o) && 'ld' in o){
          eeb.update(function(ww0){
            return ww0.splice(p[1],1)
          })
        } else {
          console.log('bad match, reject op')
        }
      }
    })
  } else {
    // first run
    wwb.update(function(ww0){
      var ww1 = $state.snapshot.words
      return ww0.concat(ww1)
    })
    eeb.update(function(ww0){
      var ww1 = $state.snapshot.eaten
      return ww0.concat(ww1)
    })
  }
}


setTimeout(function(){

  sharejs.open('words3', 'json', function(error, doc) {
	  window.$state = $state = doc;
	  doc.on('change', function (op) {
		  stateUpdate(op)
	  })
	  if (doc.created) {
      console.log('doc newly created')
		  //clear()
		  //doc.submitOp([{p:[],od:null,oi:{words:[]}}])
      doc.set({
        eaten: [],
        words: ['danya:testing'],
      })
      console.log('and the document is ', JSON.stringify(doc.get()))
	  } else {
		  stateUpdate()
	  }
	  setTimeout(begin, 1000)
  })

  sharejs.open('stats', 'json', function(error, doc) {
	  window.$stats = $stats = doc;
  })

}, 0.1*1000)


function begin(){


  0 && setInterval(function(){

    var e0 = $state.snapshot.eaten[0]
    
    $state.submitOp({
      p: ['eaten', 0], ld: e0})

  },10*100)
}

var mstate = Ctx.getBinding()

try {
  var win = window
} catch (e){}

if(win){
  win.appctx = Ctx
}

module.exports = {
  Ctx: Ctx
};

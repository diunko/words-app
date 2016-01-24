
var Morearty = require('morearty');
var React = window.React = require('react/addons');
var Router = require('director').Router;
var Immutable = require('immutable');

var words = require("./words")
var Word = words.Word
var EatenWord = words.EatenWord

var WordsInput = require("./wordsinput").WordsInput

var Ctx = (function(){

  var cursors = {}
  cursors[$clientid] = {
    idx: 0,
    eaten: '',
    left: '',
    value: '',
    body:0
  }

  return Morearty.createContext({
    initialState: {
      eaten: [],
      words: [],
      cursors: cursors,
      cursor: cursors[$clientid]
    }
  });
})()

window.$appctx = Ctx


// var Ctx = Morearty.createContext({
//   initialState: {
//     eaten: [],
//     words: [],
//     cursor: {
//       idx: 0,
//       eaten: '',
//       left: '',
//       value: '',
//       body:0
//     }
//   }
// });

var $state
var $stats


var wwb = Ctx.getBinding().sub('words')
var eeb = Ctx.getBinding().sub('eaten')
var cb = Ctx.getBinding().sub('cursor')
var ccb = Ctx.getBinding().sub('cursors')

function stateUpdate(op){
  if(op){
    console.log('docop', JSON.stringify(op))
    op.forEach(function(o){
      console.log('op', o)
      var p = o.p
      if(p.length === 0){
        if (o.oi.words && o.oi.eaten && (o.od === null || (o.od.words && o.od.eaten))){

          console.log("first op")
          
          wwb.update(function(ww0){
            return Immutable.List(o.oi.words)
          })
          eeb.update(function(ww0){
            return Immutable.List(o.oi.eaten)
          })
          cb.update(function(c){
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
        console.log('cursor', JSON.stringify(cb.get().toJS()))
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
      } else if(p.length === 1 && p[0] === "words") {
        wwb.update(function(ww0){
          return Immutable.List(o.oi)
        })
      } else if(p.length === 1 && p[0] === "eaten") {
        eeb.update(function(ee0){
          return Immutable.List(o.oi)
        })
      } else if (p.length === 1 && p[0] === "cursor"){
        console.log("cursor op")
        cb.update(function(c0){
          return Immutable.Map(o.oi)
        })
      } else if (p.length === 2 && p[0] === "cursors"){
        console.log("cursors op", op)
        ccb.sub(p[1]).update(function(c0){
          return Immutable.Map(o.oi)
        })
      } else if (p.length === 3 && p[0] === "cursors" && p[2] === "idx") {
        console.log("cursors idx op", o)
        console.log("setting offset to", o.oi)
        ccb.sub(p[1]+".idx").update(function(){
          return o.oi
        })
      } else {
        console.log("unknown op", op)
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
    cb.update(function(cc0){
      return Immutable.Map($state.snapshot.cursor)
    })
  }
}


setTimeout(function(){

  var docId = window.$docid || "words3"

  console.log("opening doc", docId)

  sharejs.open(docId, 'json', function(error, doc) {
	window.$state = $state = doc;
	doc.on('change', function (op) {
	  stateUpdate(op)
	})
	if (doc.created) {
      console.log('doc newly created')
	  //clear()
	  //doc.submitOp([{p:[],od:null,oi:{words:[]}}])
      var cursors = {}
      cursors[$clientid] = {
        idx: 0,
        eaten: '',
        left: '',
        value: '',
        body:0
      }
      
      doc.set({
        eaten: [],
        words: [],
        cursor: {
          idx: 0,
          eaten: '',
          left: '',
          value: '',
          body:0
        },
        cursors: cursors
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

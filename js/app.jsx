
var Morearty = require('morearty');
var React = window.React = require('react/addons');
var Router = require('director').Router;
var Immutable = require('immutable');

var NOW_SHOWING = Object.freeze({ ALL: 'all', ACTIVE: 'active', COMPLETED: 'completed' });
var currentId = 4;

var Ctx = Morearty.createContext({
  initialState: {
    words: ['oijoijsdf:oioijsdf', 'oijoijsdf:poijasdf', 'oijsdf:poijasdf'],
    cursor: {
      idx: 2,
      value: 'oijojoji'
    }
  }
});

var $state

function __uid(){
  return Math.floor((Math.random()*0x100000000)).toString(36)  
}

var clientid = __uid()

var wwb = Ctx.getBinding().sub('words')
var ccb = Ctx.getBinding().sub('cursor')

function stateUpdate(op){
  if(op){
    console.log('docop', JSON.stringify(op))
    op.forEach(function(o){
      var p = o.p
      if(p.length === 2 && p[0] === 'words' && typeof p[1] === 'number'){
        console.log('words op', JSON.stringify(o))
        console.log('cursor', JSON.stringify(ccb.get().toJS()))
        if('li' in o && 'ld' in o){
          wwb.update(function(ww0){
            return ww0.splice(p[1],1,o.li)
          })
        } else if('li' in o && !('ld' in o)){
          if(p[1] <= ccb.get('idx')){
            ccb.update('idx', function(ov){return ov+1})
          }
          wwb.update(function(ww0){
            return ww0.splice(p[1],0,o.li)
          })
        } else if(!('li' in o) && 'ld' in o){
          if(p[1] < ccb.get('idx')){
            ccb.update('idx', function(ov){return ov-1})
          }
          wwb.update(function(ww0){
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
  }
}


// setTimeout(function(){

//   sharejs.open('words3', 'json', function(error, doc) {
// 	  $state = doc;
// 	  doc.on('change', function (op) {
// 		  stateUpdate(op)
// 	  })
// 	  if (doc.created) {
//       console.log('doc newly created')
// 		  //clear()
// 		  //doc.submitOp([{p:[],od:null,oi:{words:[]}}])
//       doc.set({words: []})
//       console.log('and the document is ', JSON.stringify(doc.get()))
// 	  } else {
// 		  stateUpdate()
// 	  }
// 	  begin()
//   })

// }, 0.1*1000)


function begin(){

  setInterval(function(){
		$state.submitOp({
			p: ['words',0],
			li: clientid+':'+__uid()
		});
  },10*1000)
}

var mstate = Ctx.getBinding()

try {
  var win = window
} catch (e){}

if(win){
  win.appctx = Ctx
}

var App = React.createClass({
  displayName: 'App',

  mixins: [Morearty.Mixin],

  // componentDidMount: function () {
  //   var binding = this.getDefaultBinding();
  //   Router({
  //     '/': binding.set.bind(binding, 'nowShowing', NOW_SHOWING.ALL),
  //     '/active': binding.set.bind(binding, 'nowShowing', NOW_SHOWING.ACTIVE),
  //     '/completed': binding.set.bind(binding, 'nowShowing', NOW_SHOWING.COMPLETED)
  //   }).init();
  // },

  render: function () {
    var binding = this.getDefaultBinding();

    return (
      <section id='wordsapp'>
        <WordsInput className='jjj' binding={ binding }/>
      </section>
    );
  }
})

var WordsInput = React.createClass({
  displayName: 'WordsInput',

  mixins: [Morearty.Mixin],

  // componentDidMount: function(){
  //   this.focus()
  // },

  // focus: function(){
  //   this.refs.myinput.getDOMNode().focus()
  // },

  // onMouseDown: function(event){
  //   console.log('mousedown')
  //   this.focus()
  //   event.stopPropagation()
  //   event.preventDefault()
  // },

  // onKeyDown: function(event){

  //   // console.log('keydown',event)
  //   var e = {
  //     _type: 'down',
  //     keyCode: event.keyCode,
  //     charCode: event.charCode
  //   }
  //   console.log(JSON.stringify(e))
  //   event.stopPropagation()

  //   if(event.keyCode < 65 || 90 <event.keyCode){
  //     if(event.keyCode === 37){
  //       // move caret left

  //       var c = this.getDefaultBinding().sub('cursor')
  //       var cv = c.get().toJS()

  //       if(0 < cv.idx && cv.value === ''){
  //         c.update('idx', function(ov){return cv.idx-1})
  //       }
        
  //     } else if (event.keyCode === 39){
  //       // move caret right
  //       var c = this.getDefaultBinding().sub('cursor')
  //       var ww = this.getDefaultBinding().sub('words').get().toJS()
  //       var cv = c.get().toJS()

  //       if(cv.idx < ww.length && cv.value === ''){
  //         c.update('idx', function(ov){return cv.idx+1})
  //       }
  //     }else if(event.keyCode === 0x20){
  //       // space
  //       var c = this.getDefaultBinding().sub('cursor')
  //       var cv = c.get().toJS()

  //       // console.log('cursor value', JSON.stringify(cv))

  //       if(cv.value !== ''){
  //         c.update(function(){
  //           return Immutable.Map({
  //             idx:cv.idx, //+1,
  //             value:''
  //           })
  //         })

  //         $state.submitOp({p:['words', cv.idx], li: clientid+':'+cv.value})

  //       }

  //     } else if (event.keyCode === 8){
  //       // backspace
  //       var c = this.getDefaultBinding().sub('cursor')
  //       var cv = c.get().toJS()

  //       var wb = this.getDefaultBinding().sub('words')
        
  //       if(cv.value === ''){
  //         // remove word to the left
  //         if(0 < cv.idx){

  //           $state.removeAt(['words', cv.idx-1])
            
  //           c.update(function(ov){
  //             return ov.set('idx', cv.idx-1)
  //           })
            
  //         }
  //       } else {
  //         c.update(function(ov){
  //           return ov.set('value', cv.value.slice(0,-1))
  //         })
  //       }
        
  //     } else if (event.keyCode === 46){
  //       // delete
  //       var c = this.getDefaultBinding().sub('cursor')
  //       var cv = c.get().toJS()
  //       var wb = this.getDefaultBinding().sub('words')
  //       var ww = wb.get()
        
  //       if(cv.value === ''){
  //         // remove word to the right
  //         if(cv.idx < ww.count()){

  //           $state.removeAt(['words', cv.idx])

  //         }
  //       }
        
  //     }

  //     event.preventDefault()
  //   }
  // },

  // onKeyPress: function(event){
  //   // console.log('keydown',event)
  //   var e = {
  //     _type: 'press',
  //     keyCode: event.keyCode,
  //     charCode: event.charCode
  //   }
  //   //console.log(JSON.stringify(e))
  //   var keyValue = String.fromCharCode(event.charCode)

  //   var cb = this.getDefaultBinding().sub('cursor.value')
  //   cb.update(function(v){
  //     return v+keyValue
  //   })
    
  //   event.stopPropagation()
  //   event.preventDefault()
  // },

  // onKeyUp: function(event){
  //   event.stopPropagation()
  //   event.preventDefault()
  // },

  render: function () {
    var binding = this.getDefaultBinding();

    var wwb = binding.sub('words');
    var ww = wwb.get()


    function renderCursor(){
      var cb = binding.sub('cursor.value')
      return <Word binding={cb} cursor={true}/>
      
    }

    var renderWord = function(w,idx){
      var wb = wwb.sub(idx)
      return <Word binding={ wb }/>
    }

    function renderWords(ww){
      var cr = renderCursor()

      var ci = binding.get('cursor.idx')
      return ww.map(renderWord).splice(ci, 0, cr)
    }

    return (
      <section id='main' onMouseDown={this.onMouseDown}>
        <div className='inputContainer'>
          <input ref='myinput'
             type='text'
             tabindex='1'
             className='maininput'
             onKeyDown={this.onKeyDown}
             onKeyPress={this.onKeyPress} />
        </div>
        <div className='words-list' >
          { renderWords(ww).toArray() }
        </div>
      </section>
    );
  }
});



var Word = React.createClass({
  displayName: 'Word',

  mixins: [Morearty.Mixin],

  render: function () {
    var binding = this.getDefaultBinding();
    var word = binding.get();

    function renderWord(w){
      var sw = w.split(':')
      return <div className='word'>
        <span className='word'>{sw[1]}</span>
        <span className='session'>{sw[0]}</span>
      </div>
    }

    if(this.props.cursor){
      return (<div className='word cursor'>{ word }<span className='blink'>|</span></div>
       );
    } else {
      return renderWord(word);
    }

  }
});



module.exports = {
  Ctx: Ctx,
  App: App
};

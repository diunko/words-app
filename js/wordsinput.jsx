
var Router = require("director").Router
var Morearty = require('morearty');
var React = window.React = require('react/addons');
var Immutable = require('immutable');

var _ = require("./words")
var Word = _.Word
var EatenWord = _.EatenWord

var generator = require('./generator')

var Keys = require('./keys').Keys

var STRIDE_LENGTH = 40
var START = 0


var clientid = window.$clientid = (window.$clientid || __uid())

function __uid(){
  return Math.floor((Math.random()*0x100000000)).toString(36)  
}


var WordsInput = React.createClass({
  displayName: 'WordsInput',

  mixins: [Morearty.Mixin, Keys],


  componentDidMount: function () {
    var binding = this.getDefaultBinding();

    Router({
      '/:docId': function(docid){
        window.$docid = docid
        console.log("docId", docid)
      }
    }).init();

    this.focus()
  },

  focus: function(){
    this.refs.myinput.getDOMNode().focus()
  },

  onMouseDown: function(event){
    console.log('mousedown')
    this.focus()
    event.stopPropagation()
    event.preventDefault()
  },

  onInput: function(key, event){

    if(key in this.inputHandlers){
      this.inputHandlers[key].apply(this, arguments)
    }
  },

  render: function () {
    var binding = this.getDefaultBinding();

    var wwb = binding.sub('words');
    var eeb = binding.sub('eaten');
    var ww = wwb.get()
    var ee = eeb.get()

    var cb = binding.sub('cursors.'+$clientid)

    function renderCursor(){
      var cb = binding.sub('cursors.'+$clientid)
      return <Word binding={cb} cursor={true}/>
      
    }

    var renderWord = function(w,idx){

      var wb = wwb.sub(idx)
      return <Word binding={ wb }/>
    }

    function renderWords(ww){

      //var ci = binding.get('cursor.idx')
      //return ww.map(renderWord).splice(ci, 0, cr)
      var nn = ww.map(renderWord)

      return nn
    }

    function renderEatenWord(w, idx){
      var eb = eeb.sub(idx)
      return <EatenWord binding={ eb }/>
    }

    function renderEatenWords(ee){
      return ee.map(renderEatenWord)
    }

    function renderTokens(){

      var cr = renderCursor()
      var wwn = renderWords(ww)
      var een = renderEatenWords(ee)

      var ttn = een.toArray().concat(wwn.toArray())

      var cv = cb.get().toJS()

      ttn.splice(cv.idx, 0, cr)

      return ttn
      
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
          { renderTokens() }
        </div>
      </section>
    );
  },

  inputHandlers: {
    right: function(){
      var binding = this.getDefaultBinding()
      var c = binding.sub('cursors.'+$clientid)
      var cv = c.get().toJS()

      if (cv.eaten === '' && cv.left !== '') {
        $state.setAt(["cursors", $clientid], {
          idx:cv.idx,
          left:'',
          eaten: cv.left,
          value: '',
          body: cv.body
        })
      }
    },
    space: function(){
      var binding = this.getDefaultBinding()

      var c = binding.sub('cursors.'+$clientid)
      var wwb = binding.sub('words')
      var eeb = binding.sub('eaten')
      var ww = wwb.get()
      var ee = eeb.get()

      console.log('wwb.get()', ww)
      
      var cv = c.get().toJS()

      if(cv.left === '' && cv.eaten !== ''){

        var t = Date.now() - START
        START = 0

        if(0 < ww.count()){

          var w = ww.get(0)

          $state.setAt(["cursors", $clientid], {
            idx: cv.idx+1,
            eaten:'',
            left:w.split(':')[1],
            value:'',
            body: 0
            //body: cv.body+0.33333333
          })
          $state.submitOp({p:['eaten', 100000], li: t+':'+cv.eaten})
          $state.submitOp({p:['words', 0], ld: w})
          
        } else {
          
          $state.setAt(["cursors", $clientid], {
            idx:cv.idx+1,
            eaten:'',
            left:'',
            value:'',
            body: 0
            //body: cv.body+0.33333333
          })
          $state.submitOp({p:['eaten', 100000], li: t+':'+cv.eaten})

        }

      }

      if(cv.eaten === '' && cv.left === '' && 0 < ww.count()){
        var w = ww.get(0)

        START = 0
        
        $state.setAt(["cursors", $clientid],{
          idx:0,
          left:w.split(':')[1],
          eaten:'',
          value: '',
          body: cv.body
        })

        $state.submitOp({p:['words', 0], ld: w})

      }
      
      // console.log('cursor value', JSON.stringify(cv))
      
    },

    enter: function(){

      var WORDS = generator.words_random_list(STRIDE_LENGTH).map(function(w){
        return clientid+':'+w
      })

      var words01 = $state.snapshot.eaten.slice()
      var stats0 = {}
      words01.some(function(tw){
        tw = tw.split(':')
        stats0[tw[1]] = parseInt(tw[0])
      })

      $state.setAt(["cursors", $clientid],{
        idx:0,
        eaten:'',
        left:'',
        value:'',
        body: 0
      })
      $state.setAt(["words"], WORDS)
      $state.setAt(["eaten"], [])

      $stats.set(stats0)
      
    },

    backspace: function(){
      var binding = this.getDefaultBinding()

      var c = binding.sub('cursors.'+$clientid)
      var wwb = binding.sub('words')
      var eeb = binding.sub('eaten')
      var ww = wwb.get()
      var ee = eeb.get()

      console.log('wwb.get()', ww)
      
      var cv = c.get().toJS()

      if(cv.eaten === '' && 0 < ee.count()){

        var t = Date.now() - START
        START = 0

        var w = ee.get(ee.count()-1)

        $state.setAt(["cursors", $clientid],{
          idx:cv.idx-1,
          eaten:'',
          left:w.split(':')[1],
          value:'',
          body: cv.body
        })

        if (cv.left !== ''){
          $state.submitOp({p:['eaten', ee.count()-1], ld: w})
          $state.submitOp({p:['words', 0], li: clientid+':'+cv.left})            
        } else {
          $state.submitOp({p:['eaten', ee.count()-1], ld: w})
        }
      }
    },

    del: function(){
      var c = this.getDefaultBinding().sub('cursors.'+$clientid)
      var cv = c.get().toJS()
      var wb = this.getDefaultBinding().sub('words')
      var ww = wb.get()
      
      if(cv.value === ''){
        // remove word to the right
        if(cv.idx < ww.count()){

          $state.removeAt(['words', cv.idx])

        }
      }
    },

    character: function(key, event){
      var e = {
        _type: 'press',
        keyCode: event.keyCode,
        charCode: event.charCode
      }
      //console.log(JSON.stringify(e))
      var keyValue = String.fromCharCode(event.charCode)

      var cb = this.getDefaultBinding().sub('cursors.'+$clientid)
      var cv = cb.get().toJS()

      if(cv.left !== ''){

        if (START === 0){
          START = Date.now()
        }
        
        if (cv.left[0] === keyValue){

          $state.setAt(["cursors", $clientid], {
            idx:cv.idx,
            left:cv.left.slice(1),
            eaten: cv.eaten+cv.left[0],
            value:'',
            body: cv.body
          })

        } else {
          0 && $state.setAt(["cursors", $clientid], {
            idx:0,
            left:cv.left,
            eaten: cv.eaten,
            value:'',
            body: cv.body-1
          })
        }
      }
    }
    
  }
});

module.exports = {
  WordsInput: WordsInput
}



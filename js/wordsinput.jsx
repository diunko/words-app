
var Morearty = require('morearty');
var React = window.React = require('react/addons');
var Immutable = require('immutable');

var _ = require("./words")
var Word = _.Word
var EatenWord = _.EatenWord

var Keys = require('./keys').Keys


var words_dict = require('./dict')

function get_words_list(data){
  var words_list = []
  for(var w in data){
    var i = data[w]
    while(0<i--){
      words_list.push(w)
    }
  }
  return words_list
}

var words_list = get_words_list(words_dict)


var STRIDE_LENGTH = 40
var START = 0


var clientid = __uid()

function __uid(){
  return Math.floor((Math.random()*0x100000000)).toString(36)  
}

function words_random_list(words_list, len){
  var result = []
  while(0 < len--){
    var idx = Math.floor(Math.random()*words_list.length)
    result.push(words_list[idx])
  }
  return result
}



var WordsInput = React.createClass({
  displayName: 'WordsInput',

  mixins: [Morearty.Mixin, Keys],

  componentDidMount: function(){
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

    if(key === "right"){
        var binding = this.getDefaultBinding()
        var c = binding.sub('cursor')
        var cv = c.get().toJS()

        if (cv.eaten === '' && cv.left !== '') {
          c.update(function(){
            return Immutable.Map({
              idx:0,
              left:'',
              eaten: cv.left,
              value: '',
              body: cv.body
            })
          })
        }
    } else if(key === "space") {
        var binding = this.getDefaultBinding()

        var c = binding.sub('cursor')
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

            c.update(function(){
              return Immutable.Map({
                idx:0,
                eaten:'',
                left:w.split(':')[1],
                value:'',
                body: cv.body+0.33333333
              })
            })

            $state.submitOp({p:['eaten', 100000], li: t+':'+cv.eaten})
            $state.submitOp({p:['words', 0], ld: w})
            
          } else {
            
            c.update(function(){
              return Immutable.Map({
                idx:0,
                eaten:'',
                left:'',
                value:'',
                body: cv.body+0.33333333
              })
            })

            $state.submitOp({p:['eaten', 100000], li: t+':'+cv.eaten})

          }

        }

        if(cv.eaten === '' && cv.left === '' && 0 < ww.count()){
          var w = ww.get(0)

          START = 0
          
          c.update(function(){
            return Immutable.Map({
              idx:0,
              left:w.split(':')[1],
              eaten:'',
              value: '',
              body: cv.body
            })
          })

          $state.submitOp({p:['words', 0], ld: w})

        }
        
        // console.log('cursor value', JSON.stringify(cv))
    } else if(key === "enter"){

        var WORDS = words_random_list(words_list, STRIDE_LENGTH).map(function(w){
          return clientid+':'+w
        })

        var words01 = $state.snapshot.eaten.slice()
        var stats0 = {}
        words01.some(function(tw){
          tw = tw.split(':')
          stats0[tw[1]] = parseInt(tw[0])
        })

        $state.set({
          words: WORDS,
          eaten: []
        })

        $stats.set(stats0)
      
    } else if(key === "backspace"){

        var binding = this.getDefaultBinding()

        var c = binding.sub('cursor')
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

          c.update(function(){
            return Immutable.Map({
              idx:0,
              eaten:'',
              left:w.split(':')[1],
              value:'',
              body: cv.body
            })
          })

          if (cv.left !== ''){
            $state.submitOp({p:['eaten', ee.count()-1], ld: w})
            $state.submitOp({p:['words', 0], li: clientid+':'+cv.left})            
          } else {
            $state.submitOp({p:['eaten', ee.count()-1], ld: w})
          }
        }
    } else if (key === "delete"){
        var c = this.getDefaultBinding().sub('cursor')
        var cv = c.get().toJS()
        var wb = this.getDefaultBinding().sub('words')
        var ww = wb.get()
        
        if(cv.value === ''){
          // remove word to the right
          if(cv.idx < ww.count()){

            $state.removeAt(['words', cv.idx])

          }
        }
    } else if(key === "character"){

      var e = {
        _type: 'press',
        keyCode: event.keyCode,
        charCode: event.charCode
      }
      //console.log(JSON.stringify(e))
      var keyValue = String.fromCharCode(event.charCode)

      var cb = this.getDefaultBinding().sub('cursor')
      var cv = cb.get().toJS()

      if(cv.left !== ''){

        if (START === 0){
          START = Date.now()
        }
        
        if (cv.left[0] === keyValue){
          cb.update(function(v){
            return Immutable.Map({
              idx:0,
              left:cv.left.slice(1),
              eaten: cv.eaten+cv.left[0],
              value:'',
              body: cv.body
            })
          })
        } else {
          cb.update(function(v){
            return Immutable.Map({
              idx:0,
              left:cv.left,
              eaten: cv.eaten,
              value:'',
              body: cv.body-1
            })
          })
        }
      }
      
    }
    
  },

  render: function () {
    var binding = this.getDefaultBinding();

    var wwb = binding.sub('words');
    var eeb = binding.sub('eaten');
    var ww = wwb.get()
    var ee = eeb.get()

    function renderCursor(){
      var cb = binding.sub('cursor')
      return <Word binding={cb} cursor={true}/>
      
    }

    var renderWord = function(w,idx){

      var wb = wwb.sub(idx)
      return <Word binding={ wb }/>
    }

    function renderWords(ww){
      var cr = renderCursor()

      //var ci = binding.get('cursor.idx')
      //return ww.map(renderWord).splice(ci, 0, cr)
      var nn = ww.map(renderWord)

      return       nn.unshift(cr)
    }

    function renderEatenWord(w, idx){
      var eb = eeb.sub(idx)
      return <EatenWord binding={ eb }/>
    }

    function renderEatenWords(ee){
      return ee.map(renderEatenWord)
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
          { renderEatenWords(ee).toArray() }
          { renderWords(ww).toArray() }
        </div>
      </section>
    );
  }
});

module.exports = {
  WordsInput: WordsInput
}



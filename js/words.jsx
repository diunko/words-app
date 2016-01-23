
var Morearty = require('morearty');
var React = window.React = require('react/addons');


var Word = React.createClass({
  displayName: 'Word',

  mixins: [Morearty.Mixin],

  render: function () {
    var binding = this.getDefaultBinding();
    var word = binding.get()

    function renderWord(w){
      var sw = w.split(':')
      //<span className='session'>{sw[0]}</span>
      return <div className='word'>
        <span className='word'>{sw[1]}</span>
      </div>
    }

    if(this.props.cursor){
      var eaten = binding.get('eaten');
      var left = binding.get('left');
      //<div className='car-icon'></div>

      var body = binding.get('body')
      var s = '==========================================='.slice(0,Math.floor(body))
      
      return (<div className='word cursor'>
          <span className='eaten'>{ eaten+'|'+s }</span>
          <span className='blink'>|</span>
          <span className='left'>{ left }</span>
        </div>);
    } else {
      return renderWord(word);
    }

  }
});

var EatenWord = React.createClass({
  displayName: 'EatenWord',

  mixins: [Morearty.Mixin],

  render: function () {
    var binding = this.getDefaultBinding();
    var word = binding.get();

    function renderWord(w){
      var sw = w.split(':')
      //<span className='session'>{sw[0]}</span>
      var h = Math.floor(parseInt(sw[0])/5)
      
      return <div className='word eaten' style={{height: h+'px'}}>
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
  Word: Word,
  EatenWord: EatenWord
}

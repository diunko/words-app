
var Morearty = require('morearty');
var React = window.React = require('react/addons');

var WordsInput = require("./wordsinput").WordsInput

var App = React.createClass({
  displayName: 'App',

  mixins: [Morearty.Mixin],

  render: function () {
    var binding = this.getDefaultBinding();

    return (
      <section id='wordsapp'>
        <WordsInput binding={ binding } />
      </section>
    );
  }
})


module.exports = {
  App: App
};


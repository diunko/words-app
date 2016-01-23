

var words_dict = require('./dict')

function get_words_list(data){
  var data = words_dict
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


function words_random_list(len){
  var result = []
  while(0 < len--){
    var idx = Math.floor(Math.random()*words_list.length)
    result.push(words_list[idx])
  }
  return result
}


module.exports = {
  words_random_list: words_random_list
}



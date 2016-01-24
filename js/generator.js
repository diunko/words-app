
var stats = require('./stats')
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


function words_random_list_random(len){
  var result = []
  while(0 < len--){
    var idx = Math.floor(Math.random()*words_list.length)
    result.push(words_list[idx])
  }
  return result
}


function words_random_list_freq(len){

  var list = []

  for(var w in stats){
    list.push([w, stats[w]])
  }

  var ww0 = list.map(function(wf){
    return [wf[0], wf[1].reduce(function(s, f0){return s+f0}, 0) / wf[1].length]
  })

  var ww = ww0.sort(function(wf0, wf1){
    return wf0[1] - wf1[1]
  }).slice(0, len)

  console.log("sorted", JSON.stringify(ww))
  
  return ww.map(function(wf){
    return wf[0]
  })
  
}

function words_random_list_freq_reverse(len){

  var list = []

  for(var w in stats){
    list.push([w, stats[w]])
  }

  var ww0 = list.map(function(wf){
    return [wf[0], wf[1].reduce(function(s, f0){return s+f0}, 0) / wf[1].length]
  })

  var ww = ww0.sort(function(wf0, wf1){
    return - wf0[1] + wf1[1]
  }).slice(0, len)

  console.log("sorted", JSON.stringify(ww))
  
  return ww.map(function(wf){
    return wf[0]
  })
  
}

//var words_random_list = words_random_list_freq_reverse

function randomize(gen_fn, len){
  var list = gen_fn(20)

  var result = []
  while(0 < len--){
    var idx = Math.floor(Math.random()*list.length)
    result.push(list[idx])
  }
  return result
  
}

function words_random_list(len){

  return randomize(words_random_list_freq_reverse, len)
  
}



module.exports = {
  words_random_list: words_random_list
}



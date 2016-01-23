

var Keys = {

  onKeyDown: function(event){

    // console.log('keydown',event)
    var e = {
      _type: 'down',
      keyCode: event.keyCode,
      charCode: event.charCode
    }
    console.log(JSON.stringify(e))
    event.stopPropagation()

    if(event.keyCode < 65 || 90 <event.keyCode){

      if(event.keyCode === 39){
        // right arrow

        this.onInput("right")

        // console.log('cursor value', JSON.stringify(cv))

      } else if(event.keyCode === 0x20){
        // space

        this.onInput("space")


      }  else if (event.keyCode === 13){

        // enter

        this.onInput("enter")

      }  else if(event.keyCode === 8){
        // backspace
        this.onInput("backspace")

      } else if (event.keyCode === 46){
        // delete
        this.onInput("del")
        
      }

      event.preventDefault()
    }
  },

  onKeyPress: function(event){

    this.onInput("character", event)
    
    event.stopPropagation()
    event.preventDefault()
  },

  onKeyUp: function(event){
    event.stopPropagation()
    event.preventDefault()
  }
  
}


module.exports = {
  Keys: Keys
}




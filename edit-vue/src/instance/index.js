

function Vue (options){
  if(! (this instanceof Vue)) {
    new throw('Vue is a constructor and should be called with new keyword')
  }
  this._init(options)
} 
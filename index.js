if (!this.fetch) var fetch = require('node-fetch') 

module.exports = function(ob, opts) {
  if (!opts) opts = {}
  var vals = []
  var find = opts.find
  var frag = opts.frag   
  var refs = opts.refs || {}
  var root = opts.root || "http://localhost"

  if (!find) find = function(url) {
    url = url[0] == '/' ? root+url : url
    var [url,ref] = url.split('#')
    return fetch(url).then(res => res.json()).then(rec => ref||frag ? extRefs('#'+(ref||frag),rec) : rec)
  }

  function extRefs(ref, val) {
    if (!val) val = ob
    if (ref[0] != '#') return vals.push(find(ref))
    var keys = ref.substring(1).split(/[\.\/]/)
    if (!keys[0].length) keys.shift()
    while(keys.length) val = val[keys.shift()]
    return val   
  }
  
  function getRefs(ob) {
    if (ob.$ref) {
      if (!refs[ob.$ref]) refs[ob.$ref] = extRefs(ob.$ref)
    } else for (var i in ob) if (typeof ob[i] === 'object') getRefs(ob[i])
  }
  
  function fixRefs(ob) {
    if (ob.$ref) return refs[ob.$ref] ? refs[ob.$ref] : ob
    for (var k in ob) if (typeof ob[k] === 'object') ob[k] = fixRefs(ob[k])
    return ob
  } 

  getRefs(ob)

  return Promise.all(vals).then(vals => {
    for (var r in refs) if (!isNaN(refs[r])) refs[r] = vals[refs[r]-1]
    return fixRefs(ob) 
  })
}

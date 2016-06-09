if (!this.fetch) var fetch = require('node-fetch') 
 
function jsref(ob, opts)  {

  if (!opts) opts = {}
  var root = opts.root || 'http://localhost/'
  var refs = opts.refs || {}
  var $ref = opts.$ref || '$ref'
  var vals = []

  var find = opts.find || function(url) {
    url = url.indexOf('http') ? root+url : url
    var [url,ref] = url.split('#')
    ref = ref || opts.frag
    var rec = fetch(url).then(res => res.json()).then(rec => ref ? extRefs('#'+ref,rec) : rec)
    return (rec.valueOf && opts.deep) ? rec.then(rec => jsref(rec, opts)) : rec
  }

  function extRefs(ref, val) {
    if (!val) val = ob
    if (ref[0] != '#') return vals.push(find(ref))
    var keys = ref.substring(1).split(/[\.\/]/)
    if (!keys[0].length) keys.shift()
    while(val && keys.length) val = val[keys.shift()]
    return val   
  }
  
  function getRefs(ob) {
    if (ob && ob[$ref]) {
      if (!refs[ob[$ref]]) refs[ob[$ref]] = extRefs(ob[$ref])
    } else for (var i in ob) if (typeof ob[i] === 'object') getRefs(ob[i])
  }
  
  function fixRefs(ob) {
    if (ob && ob[$ref]) return refs[ob[$ref]] || ob
    for (var k in ob) if (typeof ob[k] === 'object') ob[k] = fixRefs(ob[k])
    return ob
  } 

  getRefs(ob)

  return Promise.all(vals).then(vals => {
    for (var r in refs) if (!isNaN(refs[r])) refs[r] = vals[refs[r]-1]
    return fixRefs(ob) 
  })
}

module.exports = jsref

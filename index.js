if (!this.fetch) var fetch = require('node-fetch') 

function jsref(ob, opts)  {
  if (typeof ob !== 'object') return Promise.resolve(ob)
  if (!opts) opts = {}
  var root = opts.root || 'http://localhost/'
  var $ref = opts.$ref || '$ref'
  var vals = []
  var refs = {}
  
  var find = opts.find || function(url) {
    url = url.indexOf('http') ? root+url : url
    var [url,ref] = url.split('#')
    ref = ref && ref.length ? ref : opts.frag
    var rec = fetch(url, opts.http).then(res => res.json()).then(rec => ref ? extRefs('#'+ref,rec) : rec)
    return opts.deep ? rec.then(rec => rec ? jsref(rec, opts) : rec) : rec
  }

  function extRefs(ref, val) {
    if (!val) val = ob
    if (ref[0] != '#') return opts.lazy ? find(ref) : vals.push(find(ref)) ? vals.length : 0
    var keys = ref.substring(1).split(/[\.\/]/)
    if (!keys[0].length) keys.shift()
    while(val && keys.length) val = val[keys.shift()]
    return val   
  }
  
  function getRefs(ob) {
    if (ob && ob[$ref]) {
      if (!refs[ob[$ref]] && !opts.refs[ob[$ref]]) refs[ob[$ref]] = extRefs(ob[$ref])
    } else for (var i in ob) if (typeof ob[i] === 'object') getRefs(ob[i])
  }
  
  function fixRefs(ob) {
    if (ob && ob[$ref]) return refs[ob[$ref]] || opts.refs[ob[$ref]] || ob
    for (var k in ob) if (typeof ob[k] === 'object') ob[k] = fixRefs(ob[k])
    return ob
  } 

  getRefs(ob)

  if (opts.lazy) return Promise.resolve(fixRefs(ob))

  return Promise.all(vals).then(recs => {
    for (var r in refs) if (!isNaN(refs[r])) refs[r] = recs[refs[r]-1]
    return fixRefs(ob) 
  })
}

module.exports = jsref

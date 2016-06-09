if (!this.fetch) var fetch = require('node-fetch') 
 
function jsref(ob, opts)  {
  if (!opts) opts = {}
  if (!opts.root) opts.root = 'http://localhost/'
  if (!opts.refs) opts.refs = {}
  var vals = []
  
  if (!opts.find) opts.find = function(url) {
    url = url.indexOf('http') ? opts.root+url : url
    var [url,ref] = url.split('#')
    ref = ref || opts.frag
    var rec = fetch(url).then(res => res.json()).then(rec => ref ? extRefs('#'+ref,rec) : rec)
    return opts.recur ? rec.then(rec => jsref(rec, { frag:opts.frag, root:opts.root})) : rec
  }

  function extRefs(ref, val) {
    if (!val) val = ob
    if (ref[0] != '#') return vals.push(opts.find(ref))
    var keys = ref.substring(1).split(/[\.\/]/)
    if (!keys[0].length) keys.shift()
    while(val && keys.length) val = val[keys.shift()]
    return val   
  }
  
  function getRefs(ob) {
    if (ob && ob.$ref) {
      if (!opts.refs[ob.$ref]) opts.refs[ob.$ref] = extRefs(ob.$ref)
    } else for (var i in ob) if (typeof ob[i] === 'object') getRefs(ob[i])
  }
  
  function fixRefs(ob) {
    if (ob && ob.$ref) return opts.refs[ob.$ref] || ob
    for (var k in ob) if (typeof ob[k] === 'object') ob[k] = fixRefs(ob[k])
    return ob
  } 

  getRefs(ob)

  return Promise.all(vals).then(vals => {
    for (var r in opts.refs) if (!isNaN(opts.refs[r])) opts.refs[r] = vals[opts.refs[r]-1]
    return fixRefs(ob) 
  })
}
module.exports = jsref

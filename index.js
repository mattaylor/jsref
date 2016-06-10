var fetch = fetch || require('node-fetch')

function jsref(ob, opts={}) {
  if (typeof ob !== 'object') return ob
  var $ref = opts.$ref || '$ref'
  var refs = opts.refs || {}
  var vals = []

  var find = opts.find || function(url) {
    url = url.indexOf('http') ? (opts.root || 'http://localhost/')+url : url
    return fetch(url, opts.http).then(res => res.json())
  }

  function extRefs(url) {
    var [url,ref] = url.split('#')
    ref = (ref && ref.length) ? ref : opts.frag
    var rec = find(url).then(rec => ref ? extRefs('#'+ref,rec) : rec)
    return opts.deep ? rec.then(getRefs) : rec
  }

  function setRefs(ref, val=ob) {
    if (ref[0] != '#') return opts.lazy ? extRefs(ref) : vals.push(extRefs(ref))
    var keys = ref.substring(1).split(/[\.\/]/)
    if (!keys[0].length) keys.shift()
    while(val && keys.length) val = val[keys.shift()]
    return val   
  }
  
  function getRefs(ob) {
    if (ob && ob[$ref] && (!opts.like || RegExp(opts.like).test(ob[$ref]))) {
      if (!refs[ob[$ref]]) refs[ob[$ref]] = setRefs(ob[$ref])
    } else for (var i in ob) if (typeof ob[i] === 'object') getRefs(ob[i])
    return ob
  }
   
  function fixRefs(ob) {
    if (ob && ob[$ref]) return fixRefs(refs[ob[$ref]]) || ob
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

if (typeof module == 'object') module.exports = jsref
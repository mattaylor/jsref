var fetch = fetch || require('node-fetch')

function jsref(ob, opts={}) {
  if (typeof ob !== 'object') return ob
  var $ref = opts.$ref || '$ref'
  var refs = opts.refs || {}
  var root = opts.root || 'http://localhost/'
  var find = url => fetch(url.indexOf('http') ? root+url : url, opts.http).then(res => res.json())
  var vals = []
  
  function extRef(url) {
    var [url,ref] = url.split('#')
    ref = (ref && ref.length) ? ref : opts.frag
    var rec = (opts.find||find)(url).then(rec => ref ? setRef('#'+ref,rec) : rec)
    return opts.deep ? rec.then(getRef) : rec
  }

  function setRef(ref, val=ob) {
    if (ref[0] != '#') return opts.lazy ? extRef(ref) : vals.push(extRef(ref))
    var keys = ref.substr(1).split(/[\.\/]/)
    if (!keys[0].length) keys.shift()
    while(val && keys.length) val = val[keys.shift()]
    return val
  }

  function getRef(ob) {
    if (ob && ob[$ref] && (!opts.like || RegExp(opts.like).test(ob[$ref]))) {
      if (!refs[ob[$ref]]) refs[ob[$ref]] = setRef(ob[$ref])
    } else for (var i in ob) if (typeof ob[i] === 'object') getRef(ob[i])
    return ob
  }

  function fixRef(ob) {
    if (ob && ob[$ref]) return fixRefs(refs[ob[$ref]]) || ob
    for (var k in ob) if (typeof ob[k] === 'object') ob[k] = fixRef(ob[k])
    return ob
  }

  getRef(ob)
  return opts.lazy ? Promise.resolve(fixRef(ob)) : Promise.all(vals).then(recs => {
    for (var r in refs) if (!isNaN(refs[r])) refs[r] = recs[refs[r]-1]
    return fixRef(ob)
  })
}

if (typeof module == 'object') module.exports = jsref
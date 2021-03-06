var jsref = require('./index.js')

var ob0 = { 
  a: [ { $ref: '#b.a' }, { $ref: '#b.b' } ], 
  b: { a: 'hello', b: 'world', c: { $ref: '#a.0' }  }
}

var ob1 = {
  a: [ { $ref: 'topic/topic1'}, { $ref: '#d.a' } ], 
  b: { $ref: 'topic/topic1' }, 
  c: { $ref: 'topic/AVUrpOW1MKVbp9OkmBPY' },
  d: { a: 'hello', b: { $ref: '#a.0' }  }
}

var ob2 = {
  foo: { id: 'foobar', val1: 'bar1', val2:'bar2' },
  new: [ { $ref: '#/foo/id' } , { $ref: '#/foo/val1' }, [ { $ref: '#/foo.val2' } ] ] ,
  dot: { $ref: '#foo.id' },
  fot: { $ref: 'http://json-schema.org/address' },
  bar: { $ref: 'http://json-schema.org/address#description' },
}

var opts = { 
  root:	'http://avowt.com:7511/api/1.0/avowt/',
  _refs: { 'realm/1': { name: 'realm1' } },
  keys: ['dot', 'new'],
  deep: true,
  _like: 'topic',
  _frag: 'result._source' 
}

function log(res) { console.log(JSON.stringify(res,null,2)) }

//log(jsref(ob0, { lazy:true} ))
//jsref(ob1, opts).then(log).catch(log)
jsref(ob2, opts).then(log).catch(log)
//jsref(ob2).then(log).catch(log)


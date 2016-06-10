var jsref = require('./index.js')

var ob1 = {
  a: [ { $ref: 'topic/topic1'}, { $ref: '#d.a' } ], 
  b: { $ref: 'topic/topic1' }, 
  c: { $ref: 'topic/AVUrpOW1MKVbp9OkmBPY' },
  d: { a: 'hello', b: { $ref: '#a.0' }  }
}

var ob2 = {
  foo: { id: 'foobar', value: 'bar' },
  new: { '$ref': '#/foo/id'    },
  dot: { '$ref': '#foo.id' },
  fot: { "$ref": "http://json-schema.org/address" },
  bar: { "$ref": "http://json-schema.org/address#description" },
}

var opts = { 
  root:	'http://avowt.com:7511/api/1.0/avowt/',
  refs: { 'realm/1': { name: 'realm1' } },
  deep: true,
  _like: 'topic',
  frag: 'result._source' 
}

function log(res) { console.log(JSON.stringify(res,null,2)) }

jsref(ob1, opts).then(log).catch(log)
jsref(ob2).then(log).catch(log)


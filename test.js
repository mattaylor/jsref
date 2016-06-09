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

var opts = { root:'http://avowt.com:7511/api/1.0/avowt/', recur:true, frag: 'result._source' }
//jsref(ob1, opts).catch(console.log).then(res => console.log(JSON.stringify(res)))
jsref(ob1, opts).catch(console.log).then(console.log)
//jsref(ob2).then(console.log).catch(console.log)


var deref = require('./index.js')

var ob1 = {
  a: [ { $ref: '/topic/topic1'}, { $ref: '#d.a' } ], 
  b: { $ref: '/topic/topic1' }, 
  c: { $ref: '/topic/topic2' },
  d: { a: 'hello', b: { $ref: '#a.0' }, c: { $ref: 'http://json-schema.org/draft-04/schema#properties' }, d: 'goodbye' }
}

var ob2 = {
  foo: { id: 'foobar', value: 'bar' },
  new: { '$ref': '#/foo/id'    },
  dot: { '$ref': '#foo.id' },
  fot: { "$ref": "http://json-schema.org/address" },
  bar: { "$ref": "http://json-schema.org/address#description" },
}

var opts = { root:'http://avowt.com:7511/api/1.0/avowt', frag: 'result' }
deref(ob1, opts).then(console.log).catch(console.log)
deref(ob2).then(console.log).catch(console.log)


# jsref

Ultra light json-ref dreferencing in approx 1.3k (uncompressed) with support for external and custom dreferencing

## Usage

To Install.. 

`npm install jsref --save`

Simple..

```
var jsref = require('jsref')

var ob1 = {
  foo: { id: 'foobar', value: 'bar' },
  new: { '$ref': '#/foo/id'    },
  dot: { '$ref': '#foo.id' },
  fot: { "$ref": "http://json-schema.org/address" },
  bar: { "$ref": "http://json-schema.org/address#description" },
}
jsref(ob1).then(console.log).catch(console.log)
```

With Options:  

```
var ob2 = {
  a: [ { $ref: 'topic/topic1'}, { $ref: '#d.a' } ], 
  b: { $ref: 'topic/topic1' }, 
  c: { a: 'hello', b: { $ref: '#a.0' }  }
}

var opts = { 
   root:'http://avowt.com:7511/api/1.0/avowt/', 
   deep:true,
   frag: 'result._source'
}

jsref(ob2, opts).catch(console.log).then(console.log)
```

With Custom Find.. 

```
var search = require('elasticsearch')
var client = new search.Client({host: 'localhost:9200'})

var opts = { 
   deep: true,
   find: (url) => {
     var [type, id] = url.split('/')
     return client.get({index:'myIndex', type: type, id: id})
  }
}

jsref(ob2, opts).catch(console.log).then(console.log)

```
   __NOTE__: local references __must__ be prefixed by `#`. 
   Old style JSON schema references eg `{ $ref: 'string' }` will not be resolved locally and will be treated as remote url paths__

   
## Options

Param  | Descrption | Default
-------|------------|---------
`root` | Url prefix for remote references | `http://localhost/`
`refs` | Object to use to store shared references | `{}`
`deep` | Recursively dreference remote references | `false`
`frag` | JSON Pointer Fragment identifier to extract from external results | `null`
`find` | Function that takes a non local reference and returns a promise of the result | http fetch and extract json 
`$ref` | Property name to identify references | `$ref` 
`lazy` | Return quickly with external references as promises rather than wait untill all resolved | `false` 
`http` | HTTP options to pass to `fetch` when resolveing remote references | `null`

# jsref

Ultra light quick and flexible json reference resolver with support for json pointer as well as external and custom resolvers. 

## Usage

On Node.. 

`npm install jsref --save`

In Browser.. 

`<script src="https://cdn.rawgit.com/mattaylor/jsref/master/index.js"><script>`

Then..

`jsref(input, options).then(output => { /* do something */ })`
   
__NOTE__: local references __must__ be prefixed by `#`. 
Old style JSON schema references eg `{ $ref: 'string' }` will not be resolved locally and will be treated as remote url paths__
   
## Options

Param  | Descrption | Default
-------|------------|---------
`root` | Url prefix for remote references | `http://localhost/`
`refs` | Object to use to store shared references | `{}`
`deep` | Recursively de-reference remote references | `false`
`frag` | JSON Pointer Fragment identifier to extract from external results | `null`
`find` | Function that takes a remote reference and returns a promise of the result | http fetch and extract json 
`$ref` | Property name used to identify reference values | `$ref` 
`lazy` | Return quickly without waiting for all external reference promises to resolve | `false` 
`http` | HTTP options to pass to `fetch` when resolving remote references | `null`

## Basic Example.

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

## Complex Complex:  

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

## Custom Find.. 

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

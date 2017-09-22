# jsref

Fast, flexible and Tiny (>1kb min) json reference resolver with support for json pointers, external refernences, custom resolvers and path or key based filters. 

### Usage

__On NodeJS__ 

`$ npm install jsref --save`

```javascript
var jsref = require('jsref')

var inp = { k1: 'v1', k2: { $ref: '#k1' } }
var res = jsref(inp, { lazy:true } )

```

__In Browser__

```html
<script src="https://cdn.rawgit.com/mattaylor/jsref/master/jsref.min.js"></script>
<script>
  var inp = { k1: 'v1', k2: { $ref: '#k1' } }
  var res = jsref(inp, { lazy:true } )
</script>
```

__NOTE__: local references __must__ be prefixed by `#`. 
Old style JSON schema references eg `{ $ref: 'string' }` will be resolved as remote url paths
   
### Options

Param  | Descrption  | Default
-------| ----------- | ---------
`root` | Url host and path prefix to prepend remote references | `http://localhost/`
`refs` | Object to use to store shared references | `{}`
`keys` | Array of object keys to expand (if defined), otherwise expand all keys | `null`
`deep` | Recursively de-reference remote references | `false`
`frag` | JSON Pointer Fragment identifier to extract from external results | `null`
`find` | Function that takes a remote reference and returns a promise of the result | http fetch and extract json 
`$ref` | Property name used to identify reference values | `$ref` 
`lazy` | Return immediately using promises only where necessary for external reference, (otherwise return as promise to fully resolved object) | `false` 
`http` | HTTP options to pass to `fetch` when resolving remote references | `null`
`path` | Regexp pattern that must against refs paths (if defined) to restric resolution | `null`

## Examples 

__No Options__

```javascript
var jsref = require('jsref')

var ob1 = {
  foo: { id: 'foobar', value: 'bar' },
  new: { $ref: '#/foo/id'    },
  dot: { $ref: '#foo.id' },
  fot: { $ref: "http://json-schema.org/address" },
  bar: { $ref: "http://json-schema.org/address#description" }
}

jsref(ob1).catch(console.log).then(res => { /* do something */ })
```

__With Options__

```javascript
var jsref = require('jsref')

var ob2 = {
  a: [ { $ref: 'topic/topic1'}, { $ref: '#c.a' } ], 
  b: { $ref: 'topic/topic1' }, 
  c: { a: 'hello', b: { $ref: '#a.0' }  }
}

var opts = { 
  root: 'http://avowt.com:7511/api/1.0/avowt/', 
  deep: true,
  keys: ['a']
  path: 'topic',
  refs: { 'realm/1': { name: 'realm1' } },
  frag: 'result._source'
}

jsref(ob2, opts).catch(console.log).then(res => { /* do something */ })
```

__Custom Find__

```javascript
var search = require('elasticsearch')
var client = new search.Client({host: 'localhost:9200'})
var jsref  = require('jsref')

var ob2 = {
  a: [ { $ref: 'topic/topic1'}, { $ref: '#c.a' } ], 
  b: { $ref: 'topic/topic1' },
  c: { a: 'hello', b: { $ref: '#a.0' }  }
}

var opts = { 
  deep: true,
  find: (url) => {
    var [type, id] = url.split('/')
    return client.get({index:'myIndex', type: type, id: id})
  }
}

jsref(ob2, opts).catch(console.log).then(res => { /* do something */ })
```

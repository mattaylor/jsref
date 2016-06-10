# jsref

Ultra light quick and flexible json reference resolver with support for json pointer as well as external and custom resolvers. 

### Usage

__On NodeJS__ 

`$ npm install jsref --save`

```javascript
var jsref = require('jsref')

var inp = { k1: 'v1', k2: { $ref: '#k1' } }
jsref(inp).then(res => { /* do something */ })
```

__In Browser__

```html
<script src="https://cdn.rawgit.com/mattaylor/jsref/master/index.js"></script>
<script>
  var inp = { k1: 'v1', k2: { $ref: '#k1' } }
  jsref(inp).then(res => { /* do something */ })
</script>
```

__NOTE__: local references __must__ be prefixed by `#`. 
Old style JSON schema references eg `{ $ref: 'string' }` will be resolved as remote url paths
   
### Options

Param  | Descrption  | Default
-------| ----------- | ---------
`root` | Url prefix for remote references | `http://localhost/`
`refs` | Object to use to store shared references | `{}`
`deep` | Recursively de-reference remote references | `false`
`frag` | JSON Pointer Fragment identifier to extract from external results | `null`
`find` | Function that takes a remote reference and returns a promise of the result | http fetch and extract json 
`$ref` | Property name used to identify reference values | `$ref` 
`lazy` | Return quickly without waiting for all external reference promises to resolve | `false` 
`http` | HTTP options to pass to `fetch` when resolving remote references | `null`

## Examples 

__No Options__

```javascript
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
  refs: { 'realm/1': { name: 'realm1' } },
  frag: 'result._source'
}

jsref(ob2, opts).catch(console.log).then(console.log)
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

jsref(ob2, opts).catch(console.log).then(console.log)
```

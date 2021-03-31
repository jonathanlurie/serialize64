

Encodes typed arrays (*Uint8Array*, *Float32Array*, etc.) into base64 strings with a prefix that makes it decodable back into their original typed without having to store anything on the side.

There is also a JSON encoder provided.

# Install and import
```
npm install serialize64
```

Import from a HTML file:
```HTML
<script src="serialize64.umd.js"></script>
```

Import from ES6 module:
```js
import { Codec, JSON64 } from 'serialize64'
```

# Example with simple typed arrays
All the examples are available in the [example folder](./examples).  

```js
// Some data
const someData = new Uint8Array([1, 2, 3, 4, 5, 6, 99])

// encoding:
const someStrData = serialize64.Codec.encode(someData)
// the value is "_S64___ui8:AQIDBAUGYw=="

// decoding:
const decoded = serialize64.Codec.decode(someStrData)
// the value is Uint8Array([1, 2, 3, 4, 5, 6, 99])
```

# Example with JSON
```js
// Create some data:
const data = {
  aString: 'hello there',
  aNumber: 42,
  anArray: [0, 'one', 'deux', 'tres', 4],
  anObject: {
    aUint8Array: new Uint8Array([1, 2, 3, 4, 5, 6, 7]),
    aFloat32Array: new Float32Array([1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7]),
    anotherArray: [
      'a string',
      422,
      new Int32Array([-100000, 32, 9999999])
    ]
  }
}

// Encoding:
const json64Serialized = serialize64.JSON64.stringify(data, null, 2)

// Decoding:
const dataDecoded = serialize64.JSON64.parse(json64Serialized)
```

## Replacers and revivers
The *JSON64* serializer is using the regular *JSON* shipped with JS and it simply adds `Codec.encode()` and `Codec.decode()` as JSON replacers and revivers.  
That being said, it is still possible to add your custom replacers and revivers **in addition to** the the one from Serialize64. 

```js
// Some data:
const data = {
  aString: 'hello there',
  aNumber: 42,
  anArray: [0, 'one', 'deux', 'tres', 4],
  anObject: {
    aUint8Array: new Uint8Array([1, 2, 3, 4, 5, 6, 7]),
    aFloat32Array: new Float32Array([1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7]),
    anotherArray: [
      'a string',
      422,
      new Int32Array([-100000, 32, 9999999])
    ]
  }
}


const replacer = (key, value) => {
  return typeof value === 'number' ? value * 2 : value
}


const reviver = (key, value) => {
  return typeof value === 'number' ? value / 2 : value
}

// Encoding:
const json64Serialized = serialize64.JSON64.stringify(data, replacer, 2)

// Decoding:
const dataDecoded = serialize64.JSON64.parse(json64Serialized, reviver)
```

Note that your custom replacer is performing just before the serialize64 replacer, while your custom reviver is performing just after the serialize64 reviver. This ensures that custom replacers/reviver that would apply some change on numerical data are still doing their job as expected and the custom ones who are performing actions on strings are not messing up with the internal representation of serialize64.
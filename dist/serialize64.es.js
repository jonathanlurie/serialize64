import { Base64 } from 'js-base64';

const constants = {
  PREFIX: '_S64_',
  SEPARATOR: ':',
};

/**
 * From typed array constructor name to fixed length descriptor
 */
const TYPE_TO_FLAG = {
  'Int8Array'     : '___i8',
  'Uint8Array'    : '__ui8',
  'Int16Array'    : '__i16',
  'Uint16Array'   : '_ui16',
  'Int32Array'    : '__i32',
  'Uint32Array'   : '_ui32',
  'BigInt64Array' : '__i64',
  'BigUint64Array': '_ui64',
  'Float32Array'  : '__f32',
  'Float64Array'  : '__f64',
  'ArrayBuffer'   : '___ab',
};

// the reverse LUT
let FLAG_TO_TYPE = {
  '___i8': Int8Array,
  '__ui8': Uint8Array,
  '__i16': Int16Array,
  '_ui16': Uint16Array,
  '__i32': Int32Array,
  '_ui32': Uint32Array,
  '__i64': BigInt64Array,
  '_ui64': BigUint64Array,
  '__f32': Float32Array,
  '__f64': Float64Array,
  '___ab': ArrayBuffer,
};

constants.PREFIX_LENGTH = constants.PREFIX.length + constants.SEPARATOR.length + Object.values(TYPE_TO_FLAG)[0].length;


class Codec {
  /**
   * Encode from a typed array to base64 prepended with a markup
   * @param {*} data 
   */
  static encode(data) {
    if (!(data.constructor.name in TYPE_TO_FLAG)) {
      return data
    }

    let byteArray = null;

    if (data.constructor.name === ArrayBuffer) {
      byteArray = new Uint8Array(data);
    } else {
      byteArray = new Uint8Array(data.buffer);
    }

    const b64 = Base64.fromUint8Array(byteArray);
    const encoded = `${constants.PREFIX}${TYPE_TO_FLAG[data.constructor.name]}${constants.SEPARATOR}${b64}`;
    return encoded
  }

  static decode(data) {
    if (typeof data !== 'string') {
      return data
    }

    if (!data.startsWith(constants.PREFIX)) {
      return data
    }

    const prefix = data.slice(0, constants.PREFIX_LENGTH); 
    const b64 = data.slice(constants.PREFIX_LENGTH);
    const bytes = Base64.toUint8Array(b64);
    const binaryConstructor = FLAG_TO_TYPE[prefix.slice(constants.PREFIX.length, prefix.length - 1 )];
    const decodedData = new binaryConstructor(bytes.buffer);
    return decodedData
  }
}

class JSON64 {
  static parse(text, reviver) {

    const reviver64 = (key, value) => {
      let decodedValue = Codec.decode(value);
      if (typeof reviver === 'function') {
        decodedValue = reviver(key, decodedValue);
      }
      return decodedValue
    };

    return JSON.parse(text, reviver64)
  }


  static stringify(value, replacer = null, space = null) {

    const replacer64 = (key2, value2) => {
      let replacedValue = value2;
      if (typeof replacer === 'function') {
        replacedValue = replacer(key2, value2);
      }
      return Codec.encode(replacedValue)
    };

    return JSON.stringify(value, replacer64, space)
  }


}

export { Codec, JSON64 };
//# sourceMappingURL=serialize64.es.js.map

import { Base64 } from 'js-base64'

const constants = {
  PREFIX: '_#OT#_',
  SEPARATOR: ':',
}

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
}

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
}

constants.PREFIX_LENGTH = constants.PREFIX.length + constants.SEPARATOR.length + Object.values(TYPE_TO_FLAG)[0].length


export default class BinaryCodec {
  /**
   * Encode from a typed array to base64 prepended with a markup
   * @param {*} data 
   */
  static encode(data) {
    if (!(data.constructor.name in TYPE_TO_FLAG)) {
      return data
    }

    let byteArray = null

    if (data.constructor.name === ArrayBuffer) {
      byteArray = new Uint8Array(data)
    } else {
      byteArray = new Uint8Array(data.buffer)
    }

    const b64 = Base64.fromUint8Array(byteArray)
    const encoded = `${constants.PREFIX}${TYPE_TO_FLAG[data.constructor.name]}${constants.SEPARATOR}${b64}`
    return encoded
  }

  static decode(str) {
    if (!str.startsWith(constants.PREFIX)) {
      return str
    }

    const prefix = str.slice(0, constants.PREFIX_LENGTH) 
    const b64 = str.slice(constants.PREFIX_LENGTH)
    const bytes = Base64.toUint8Array(b64)
    const binaryConstructor = FLAG_TO_TYPE[prefix.slice(constants.PREFIX.length, prefix.length - 1 )]
    const data = new binaryConstructor(bytes.buffer)
    return data
  }
}
import Codec from './Codec'

export default class JSON64 {
  static parse(text, reviver) {

    const reviver64 = (key, value) => {
      let decodedValue = Codec.decode(value)
      if (typeof reviver === 'function') {
        decodedValue = reviver(key, decodedValue)
      }
      return decodedValue
    }

    return JSON.parse(text, reviver64)
  }


  static stringify(value, replacer = null, space = null) {

    const replacer64 = (key2, value2) => {
      let replacedValue = value2
      if (typeof replacer === 'function') {
        replacedValue = replacer(key2, value2)
      }
      return Codec.encode(replacedValue)
    }

    return JSON.stringify(value, replacer64, space)
  }


}
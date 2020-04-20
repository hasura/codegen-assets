import { TypeConverter, BaseTypeConverterConfig } from './BaseTypeConverter'
import { NEWLINE } from '../utils'
import { LanguageTypeConverterConfig, ScalarTypes } from '../types'

export class GoTypeConverter extends TypeConverter {
  constructor(config: LanguageTypeConverterConfig) {
    const goLangScalarMap = {
      [ScalarTypes.ID]: `int`,
      [ScalarTypes.INT]: `int`,
      [ScalarTypes.FLOAT]: `float32`,
      [ScalarTypes.STRING]: `string`,
      [ScalarTypes.BOOLEAN]: `bool`,
    }

    const baseConfig: BaseTypeConverterConfig = {
      schema: config.schema,
      actionName: config.actionName,
      scalarMap: goLangScalarMap,
      // type MyType struct {  }
      typeClassIdentifier: (name) => `type ${name} struct`,
      typeDelimiters: ['{' + NEWLINE, NEWLINE + '}'],
      fieldDelimiter: NEWLINE,
      fieldFormatter: (name, typeNode, nullable) => {
        let { list, type } = typeNode
        // string -> []string
        if (list) type = `[]${type}`
        // []string -> *[]string
        if (nullable) type = `*${type}`
        // usernames []string*
        return `${name} ${type}`
      },
    }

    super(baseConfig)
  }
}

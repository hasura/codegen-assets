import { TypeConverter, BaseTypeConverterConfig } from './BaseTypeConverter'
import { ScalarTypes, LanguageTypeConverterConfig } from '../types'
import { NEWLINE } from '../utils'

export class TSTypeConverter extends TypeConverter {
  constructor(config: LanguageTypeConverterConfig) {
    const scalarMap = {
      [ScalarTypes.ID]: `number`,
      [ScalarTypes.INT]: `number`,
      [ScalarTypes.FLOAT]: `number`,
      [ScalarTypes.STRING]: `string`,
      [ScalarTypes.BOOLEAN]: `boolean`,
    }

    const baseConfig: BaseTypeConverterConfig = {
      schema: config.schema,
      actionName: config.actionName,
      scalarMap,
      // type MyType = {  }
      typeClassIdentifier: (name) => `type ${name} = `,
      typeDelimiters: ['{' + NEWLINE, NEWLINE + '}'],
      fieldDelimiter: NEWLINE,
      fieldFormatter: (name, typeNode, nullable) => {
        let { required, list, type } = typeNode
        // string -> Maybe<string>
        if (!required) type = `Maybe<${type}>`
        // Maybe<string> -> Array<Maybe<string>>
        if (list) type = `Array<${type}>`
        // Array<Maybe<string>> -> Maybe<Array<Maybe<string>>>
        if (nullable && list) type = `Maybe<${type}>`
        if (nullable) name = `${name}?`
        return `${name}: ${type}`
      },
      extraTypes: `type Maybe<T> = T | null`,
    }
    super(baseConfig)
  }
}

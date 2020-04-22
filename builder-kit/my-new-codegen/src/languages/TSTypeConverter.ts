import { TypeConverter, BaseTypeConverterConfig } from './BaseTypeConverter'
import { ScalarTypes, LanguageTypeConverterConfig } from '../types'
import { NEWLINE, indent } from '../utils'

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
      isAction: config.isAction ?? true,
      schema: config.schema,
      scalarMap,
      prepend: `${NEWLINE}type Maybe<T> = T | null${NEWLINE} ${NEWLINE}`,
      typeConversionConfig: {
        // type MyType = {  }
        classIdentifier: (name) => `type ${name} = `,
        typeDelimiters: ['{' + NEWLINE, NEWLINE + '}' + NEWLINE],
        fieldDelimiter: NEWLINE,
        fieldFormatter: (name, typeNode, nullable) => {
          // GraphQL Field = username: [String]
          let { required, list, type } = typeNode
          // string -> Maybe<string>
          if (!required) type = `Maybe<${type}>`
          // Maybe<string> -> Array<Maybe<string>>
          if (list) type = `Array<${type}>`
          // Array<Maybe<string>> -> Maybe<Array<Maybe<string>>>
          if (nullable && list) type = `Maybe<${type}>`
          // username: -> username?:
          if (nullable) name = `${name}?`
          // username?: Maybe<Array<Maybe<string>>>
          return `${name}: ${type}`
        },
      },
      enumConverionConfig: {
        classIdentifier: (name) => `enum ${name} `,
        typeDelimiters: ['{' + NEWLINE, NEWLINE + '}' + NEWLINE],
        fieldDelimiter: ',' + NEWLINE,
        valueFormatter: (node) => indent(`${node.value} = '${node.value}'`),
      },
    }
    super(baseConfig)
  }
}

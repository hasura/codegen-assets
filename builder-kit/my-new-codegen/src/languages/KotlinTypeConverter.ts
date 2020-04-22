import { TypeConverter, BaseTypeConverterConfig } from './BaseTypeConverter'
import { LanguageTypeConverterConfig, ScalarTypes } from '../types'
import { NEWLINE } from '../utils'

export class KotlinTypeConverter extends TypeConverter {
  constructor(config: LanguageTypeConverterConfig) {
    const kotlinScalarMap = {
      [ScalarTypes.ID]: `Int`,
      [ScalarTypes.INT]: `Int`,
      [ScalarTypes.FLOAT]: `Float`,
      [ScalarTypes.STRING]: `String`,
      [ScalarTypes.BOOLEAN]: `Boolean`,
    }

    const baseConfig: BaseTypeConverterConfig = {
      isAction: config.isAction ?? true,
      schema: config.schema,
      scalarMap: kotlinScalarMap,
      typeConversionConfig: {
        // data class MyType( )
        classIdentifier: (name) => `data class ${name}`,
        typeDelimiters: ['(', ')'],
        fieldDelimiter: ', ',
        fieldFormatter: (name, typeNode, nullable) => {
          let { required, list, type } = typeNode
          // String -> String?
          if (!required) type = `${type}?`
          // String? -> List<String?>
          if (list) type = `List<${type}>`
          // List<String?> -> List<String?>?
          if (nullable && list) type = `${type}?`
          // var usernames: List<String?>
          return `var ${name}: ${type}`
        },
      },
      // enum class Direction {
      //   NORTH, SOUTH, WEST, EAST
      // }
      enumConverionConfig: {
        // enum class MyEnum {}
        classIdentifier: (name) => `enum class ${name} `,
        typeDelimiters: ['{' + NEWLINE + '\t', NEWLINE + '}'],
        fieldDelimiter: ', ',
        valueFormatter: (node) => node.value,
      },
    }

    super(baseConfig)
  }
}

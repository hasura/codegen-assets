import { TypeConverter, BaseTypeConverterConfig } from './BaseTypeConverter'
import { LanguageTypeConverterConfig, ScalarTypes } from '../types'

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
      schema: config.schema,
      actionName: config.actionName,
      scalarMap: kotlinScalarMap,
      // data class MyType( )
      typeClassIdentifier: (name) => `data class ${name}`,
      typeDelimiters: ['(', ')'] as [string, string],
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
    }

    super(baseConfig)
  }
}

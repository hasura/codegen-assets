import { TypeConverter, BaseTypeConverterConfig } from './BaseTypeConverter'
import { NEWLINE, indent } from '../utils'
import { LanguageTypeConverterConfig, ScalarTypes } from '../types'

export class GoTypeConverter extends TypeConverter {
  // Really stupid, need this for enums
  firstFieldSet: boolean
  constructor(config: LanguageTypeConverterConfig) {
    const goLangScalarMap = {
      [ScalarTypes.ID]: `int`,
      [ScalarTypes.INT]: `int`,
      [ScalarTypes.FLOAT]: `float32`,
      [ScalarTypes.STRING]: `string`,
      [ScalarTypes.BOOLEAN]: `bool`,
    }

    const baseConfig: BaseTypeConverterConfig = {
      isAction: config.isAction ?? true,
      schema: config.schema,
      scalarMap: goLangScalarMap,
      typeConversionConfig: {
        // type MyType struct {  }
        classIdentifier: (name) => `type ${name} struct`,
        typeDelimiters: ['{\n', '\n}\n'],
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
      },
      // type LeaveType string
      // const(
      //   AnnualLeave LeaveType = "AnnualLeave"
      //   Sick = "Sick"
      //   BankHoliday = "BankHoliday"
      //   Other = "Other"
      // )
      // Oh man this is awful
      // See this + postFormat down below
      enumConverionConfig: {
        classIdentifier: (name) => `type __ENUM_VALUE__${name} string \n\n`,
        typeDelimiters: ['const(\n', '\n)'],
        fieldDelimiter: NEWLINE,
        valueFormatter: (node) => {
          const name = node.value
          const type = indent(`${name} = "${name}"`)
          if (this.firstFieldSet) return type
          else {
            // Only do this the first time to set the type of all enum values
            this.firstFieldSet = true
            // Replace this with regex in postFormat()
            return `__ENUM_VALUE__ ${type}`
          }
        },
      },
      // Use the post-format function to replace the enum value name in the text
      postFormat: (typeDefs) => {
        const enumTypeRegex = /(__ENUM_VALUE__)(\w+)/
        const match = enumTypeRegex.exec(typeDefs)
        if (match) {
          const [, , enumType] = match
          // replace first find with nothing to strip it
          const normalizedDefs = typeDefs.replace('__ENUM_VALUE__', '')
          // replace second find with the actual value from marker
          const finalizedDefs = normalizedDefs.replace(
            '__ENUM_VALUE__',
            indent(enumType)
          )
          return finalizedDefs
        } else return typeDefs
      },
    }

    super(baseConfig)
  }
}

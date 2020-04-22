import { ScalarMap, ITypeNode, IField, ITypeMap, IEnumNode } from '../types'
import { buildBaseTypes } from '../schemaTools'
import { NEWLINE, isScalar, indent } from '../utils'

interface AbstractConversionConfig {
  classIdentifier: (name: string) => string
  typeDelimiters: [string, string]
  fieldDelimiter: string | null
}

interface TypeConversionConfig extends AbstractConversionConfig {
  fieldFormatter: (name: string, type: ITypeNode, nullable: boolean) => string
}

interface EnumConversionConfig extends AbstractConversionConfig {
  valueFormatter?: (value: IEnumNode) => string
}

/**
 * The BaseTypeConverterConfig interface provides the full specification
 * that a language-specific converter needs to implement to define a mapping
 * between GraphQL types/scalars and the language's
 * @param schema Action SDL string
 * @param scalarMap A mapping
 * @param typeClassIdentifier What the identifier for a type is called in the language
 * @param typeDelimiters the opening and closing characters for a "type" (IE curly braces, or parens for Kotlin Dataclasses)
 * @param fieldFormatter Function for how to format individual fields of a type in a class/struct/interface
 * @param prepend optional text to put at the top of the type definitions
 * @param postFormat optional function that takes the finalized typedefs string and allows for further processing
 * @param isAction whether or not it's a Hasura Action (so that input argument types can be generated)
 */
export interface BaseTypeConverterConfig {
  schema: string
  scalarMap: ScalarMap
  typeConversionConfig: TypeConversionConfig
  enumConverionConfig?: EnumConversionConfig
  prepend?: string
  postFormat?: (typeDefs: string) => string
  isAction: boolean
}

export class TypeConverter {
  config: BaseTypeConverterConfig
  typeMap: ITypeMap
  constructor(config: BaseTypeConverterConfig) {
    this.config = config
    this.typeMap = buildBaseTypes(config.schema, config.isAction)
  }
  /**
   * Converts a TypeMap object to language-specific type definition strings
   * using the TypeConverter for the language provided
   */
  generateTypes() {
    const { prepend, postFormat } = this.config
    let typeDefs = ''
    // If there are extra types, start the type definitions out with them included
    if (prepend) typeDefs += prepend
    // Iterates the types of the Action params and generates language types for them one-by-one
    typeDefs = this.makeTypeStrings(typeDefs)
    // Iterates the enums of the Action params and generates language enums for them one-by-one
    typeDefs = this.makeEnumStrings(typeDefs)
    // Calls the optional postFormat() function if provided
    if (postFormat) return postFormat(typeDefs)
    else return typeDefs
  }

  private makeTypeStrings(typeDefs: string) {
    const { typeDelimiters, classIdentifier } = this.config.typeConversionConfig
    const [openSymbol, closeSymbol] = typeDelimiters
    for (let [type, fields] of Object.entries(this.typeMap.types)) {
      const typeName = classIdentifier(type)
      const fieldTypes = this.getEntryFieldTypes(fields)
      const definition = typeName + openSymbol + fieldTypes + closeSymbol
      typeDefs += definition + NEWLINE
    }
    return typeDefs
  }

  private makeEnumStrings(typeDefs: string) {
    const {
      typeDelimiters,
      fieldDelimiter,
      classIdentifier,
      valueFormatter,
    } = this.config.enumConverionConfig
    const [enumOpenSymbol, enumCloseSymbol] = typeDelimiters
    for (let [type, values] of Object.entries(this.typeMap.enums)) {
      const typeName = classIdentifier(type)
      const enumFields = values.map(valueFormatter).join(fieldDelimiter)
      const definition =
        typeName + enumOpenSymbol + enumFields + enumCloseSymbol
      typeDefs += definition + NEWLINE
    }
    return typeDefs
  }

  /**
   * Converts all fields of a type to language-specific type strings separated by newlines
   * by running them all through makeFieldType()
   */
  getEntryFieldTypes(fields: IField[]): string {
    const { fieldDelimiter } = this.config.typeConversionConfig
    return fields.map((field) => this.makeFieldType(field)).join(fieldDelimiter)
  }
  /**
   * Converts a GraphQL type to language-specific type
   */
  convertType(type: ITypeNode): string {
    const { scalarMap } = this.config
    const convertedType = isScalar(type) ? scalarMap[type.name] : type.name
    return convertedType
  }
  /**
   * Converts a field of a type to language-specific type string
   * TODO: Should probably remove the indent() function here
   */
  makeFieldType(field: IField) {
    const { fieldFormatter } = this.config.typeConversionConfig
    const { type, name, required } = field
    const nullable = !required
    type.type = this.convertType(type)
    return indent(fieldFormatter(name, type, nullable))
  }
}

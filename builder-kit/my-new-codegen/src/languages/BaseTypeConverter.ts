import { ScalarMap, ITypeNode, IField, ITypeMap } from '../types'
import { buildBaseTypes } from '../schemaTools'
import { NEWLINE, isScalar, indent } from '../utils'

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
  typeClassIdentifier: (type: string) => string
  typeDelimiters: [string, string]
  fieldDelimiter: string | null
  fieldFormatter: (name: string, type: ITypeNode, nullable: boolean) => string
  prepend?: string
  postFormat?: (string) => string
  isAction: boolean
}

export class TypeConverter {
  config: BaseTypeConverterConfig
  types: ITypeMap
  constructor(config: BaseTypeConverterConfig) {
    this.config = config
    this.types = buildBaseTypes(config.schema, config.isAction)
  }
  /**
   * Converts a TypeMap object to language-specific type definition strings
   * using the TypeConverter for the language provided
   */
  generateTypes() {
    const {
      typeClassIdentifier,
      typeDelimiters,
      prepend,
      postFormat,
    } = this.config
    let typeDefs = ''
    // If there are extra types, start the type definitions out with them included
    if (prepend) typeDefs += prepend
    const [openSymbol, closeSymbol] = typeDelimiters
    // Iterates the type of the Action params and generates language types for them one-by-one
    for (let [type, fields] of Object.entries(this.types)) {
      const typeName = typeClassIdentifier(type)
      const fieldTypes = this.getEntryFieldTypes(fields)
      const definition = typeName + openSymbol + fieldTypes + closeSymbol
      typeDefs += definition + NEWLINE
    }
    if (postFormat) return postFormat(typeDefs)
    else return typeDefs
  }
  /**
   * Converts all fields of a type to language-specific type strings separated by newlines
   * by running them all through makeFieldType()
   */
  getEntryFieldTypes(fields: IField[]): string {
    const { fieldDelimiter } = this.config
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
   */
  makeFieldType(field: IField) {
    const { fieldFormatter } = this.config
    const { type, name, required } = field
    const nullable = !required
    console.log(type)
    type.type = this.convertType(type)
    return indent(fieldFormatter(name, type, nullable))
  }
}

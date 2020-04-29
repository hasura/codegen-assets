import { IntrospectionQuery } from 'graphql'

/**
 * LanguageTypeConverterConfigs are stripped-down BaseTypeConverterConfig that require
 * the user provide only the schema and Action name, because in the constructor the rest of
 * values for scalarMap, type, and field formatting have already been pre-filled.
 */
export interface LanguageTypeConverterConfig {
  schema: string
  isAction?: boolean
}

/**
 * An Enum for GraphQL scalars
 * Used to compose ScalarMaps for language-specific types codegen
 */
export enum ScalarTypes {
  ID = 'ID',
  INT = 'Int',
  FLOAT = 'Float',
  STRING = 'String',
  BOOLEAN = 'Boolean',
}
/**
 * An interface that TypeConverters must implement for how to
 * map GraphQL scalars to their corresponding language types
 */
export type ScalarMap = {
  [key in ScalarTypes]: string
}

/**
 * @param name the original type/name of the type
 * @param type the converted language-specific type (if scalar)
 * @param required whether the type is required or not
 * @param list whether the type is a list/array
 */
export interface ITypeNode {
  name: string
  type: string
  required: boolean
  list: boolean
}

/**
 * A convenience interface for the reprensentation of a field type in GraphQL
 * Provides formatted information about name, type, nullability, and is list
 * @interface IField
 */
export interface IField {
  name: string
  type: ITypeNode
  required: boolean
}

/**
 * An interface for the paramaters of Action codegen functions
 * The type provides the name, return type, list of action arguments
 * and a type-map of all types in the Action SDL
 * @interface ActionParams
 */
export interface ActionParams {
  actionName: string
  actionArgs: IField[]
  returnType: string
  types: ITypeMap
}

export interface CodegenTemplateParams extends ActionParams {
  typeDefs: string
  derive: DeriveParams
}

/**
 * A Typemap of schema types and their fields extracted and serialized
 * @interface ITypeMap
 */
export interface ITypeMap {
  [key: string]: IField[]
}

/**
 *  GENERATED TYPES FOR DERIVE INTROSPECTION RESPONSE USING QUICKTYPE.IO
 *  THE INTROSPECTION QUERY RESPONSE IS NOT COMPATIBLE WITH GRAPHQL'S
 *  "IntrospectionQuery" TYPE SO THESE WERE GENERATED AUTOMATICALLY
 */

/**
 * A type for the "derive" parameter of codegen templates
 * @interface DeriveParams
 */
export interface DeriveParams {
  operation: string
  endpoint: string
}

export interface IntrospectionSchema {
  __schema: Schema
}

export interface Schema {
  directives: Directive[]
  mutationType: Type
  queryType: Type
  subscriptionType: Type
  types: TypeElement[]
}

export interface Directive {
  args: Arg[]
  description: null
  locations: string[]
  name: string
}

export interface Arg {
  defaultValue: null | string
  description: null | string
  name: string
  type: OfTypeClass
}

export interface OfTypeClass {
  kind: Kind
  name: null | string
  ofType: OfTypeClass | null
}

export type Kind =
  | 'ENUM'
  | 'INPUT_OBJECT'
  | 'LIST'
  | 'NON_NULL'
  | 'OBJECT'
  | 'SCALAR'

export interface Type {
  name: string
}

export interface TypeElement {
  description: null | string
  enumValues: EnumValue[] | null
  fields: Field[] | null
  inputFields: Arg[] | null
  interfaces: any[] | null
  kind: Kind
  name: string
  possibleTypes: null
}

export interface EnumValue {
  deprecationReason: null
  description: null | string
  isDeprecated: boolean
  name: string
}

export interface Field {
  args: Arg[]
  deprecationReason: null
  description: null | string
  isDeprecated: boolean
  name: string
  type: OfTypeClass
}

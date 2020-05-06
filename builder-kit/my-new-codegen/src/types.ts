import {
  FieldDefinitionApi,
  ScalarTypeApi,
  ArgumentApi,
  InputValueDefinitionApi,
  ScalarTypeDefinitionNodeProps,
  EnumValueDefinitionApi,
} from 'graphql-extra'

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

export interface IEnumNode {
  value: string
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
  actionArgs: InputValueDefinitionApi[]
  returnType: string
  typeMap: ITypeMap
}

export interface CodegenTemplateParams extends ActionParams {
  typeDefs?: string
  derive: DeriveParams | null
}

export type Fieldlike = FieldDefinitionApi | InputValueDefinitionApi

export interface ITypeMap {
  types: Record<string, Fieldlike[]>
  enums: Record<string, EnumValueDefinitionApi[]>
  scalars: Record<string, ScalarTypeApi>
}

/**
 * A type for the "derive" parameter of codegen templates
 * @interface DeriveParams
 */
export interface DeriveParams {
  operation: string
  endpoint: string
}

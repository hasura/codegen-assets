import { ScalarTypes, Fieldlike, ITypeMap } from '../types'
import { serialize, isScalar } from '../utils'
import { buildBaseTypes } from '../schemaTools'
import { html as template } from 'common-tags'
import { EnumValueDefinitionApi, ScalarTypeApi } from 'graphql-extra'

const scalarMap = {
  [ScalarTypes.ID]: `number`,
  [ScalarTypes.INT]: `number`,
  [ScalarTypes.FLOAT]: `number`,
  [ScalarTypes.STRING]: `string`,
  [ScalarTypes.BOOLEAN]: `boolean`,
}

const fieldFormatter = (field: Fieldlike) => {
  let { name, required, list, type } = serialize(field)
  let T = isScalar(type) ? scalarMap[type] : type
  if (!required) T = `[${T}]`
  if (list) T = `Array<${T}>`
  return { name, type: T }
}
const jsdocTypeDef = (typeName, fields: Fieldlike[]) => {
  const fieldDefs = fields
    .map(fieldFormatter)
    .map(({ name, type }) => `* @property {${type}} ${name}`)
    .join('\n')

  return template`
     /** 
       * @typedef {Object} ${typeName}
       ${fieldDefs}
       */
    `
}

const typeMapToJSDocTypes = (typeMap: ITypeMap) =>
  Object.entries(typeMap.types)
    .map(([typeName, fields]) => jsdocTypeDef(typeName, fields))
    .join('\n\n')

const jsdocEnumDef = (typeName, fields: EnumValueDefinitionApi[]) => {
  const fieldDefs = fields
    .map((field) => `* @property {string} ${field.getName()}`)
    .join('\n')

  return template`
      /** 
       * @enum {Object} ${typeName}
       ${fieldDefs}
       */
    `
}
const jsdocScalarDef = (scalarType: ScalarTypeApi) =>
  template`
      /** 
       * @typedef {string} ${scalarType.getName()}
       */
    `

const typeMapToJSDocEnums = (typeMap: ITypeMap) =>
  Object.entries(typeMap.enums)
    .map(([typeName, fields]) => jsdocEnumDef(typeName, fields))
    .join('\n\n')

const typeMapToJSDocScalars = (typeMap: ITypeMap) =>
  Object.entries(typeMap.scalars)
    .map(([_, scalarType]) => jsdocScalarDef(scalarType))
    .join('\n\n')

const typeMapToJSDoc = (typeMap: ITypeMap) =>
  typeMapToJSDocScalars(typeMap) +
  '\n\n' +
  typeMapToJSDocEnums(typeMap) +
  '\n\n' +
  typeMapToJSDocTypes(typeMap)

export const graphqlSchemaToJSDoc = (schema: string) =>
  typeMapToJSDoc(buildBaseTypes(schema))

import { ScalarTypes, ITypeMap, Fieldlike } from '../types'
import { isScalar, serialize } from '../utils'
import { buildBaseTypes } from '../schemaTools'
import { html as template } from 'common-tags'
import { EnumValueApi } from 'graphql-extra'

const scalarMap = {
  [ScalarTypes.ID]: `Int`,
  [ScalarTypes.INT]: `Int`,
  [ScalarTypes.FLOAT]: `Float`,
  [ScalarTypes.STRING]: `String`,
  [ScalarTypes.BOOLEAN]: `Boolean`,
}

const fieldFormatter = (field: Fieldlike) => {
  let { name, required, list, type } = serialize(field)
  let T = isScalar(type) ? scalarMap[type] : type
  // String -> String?
  if (!required) T = `${T}?`
  // String? -> List<String?>
  if (list) T = `List<${T}>`
  // List<String?> -> List<String?>?
  if (!required && list) T = `${T}?`
  return { name, type: T }
}

const kotlinTypeDef = (typeName: string, fields: Fieldlike[]): string => {
  const fieldDefs = fields
    .map(fieldFormatter)
    .map(({ name, type }) => `var ${name}: ${type}`)
    .join(', ')

  return `data class ${typeName}(${fieldDefs})`
}

const typeMapToKotlinTypes = (typeMap: ITypeMap) =>
  Object.entries(typeMap.types)
    .map(([typeName, fields]) => kotlinTypeDef(typeName, fields))
    .join('\n\n')

const kotlinEnumDef = (typeName: string, fields: EnumValueApi[]): string => {
  const fieldDefs = fields.map((field) => field.getName()).join(', ')

  return template`
    enum class ${typeName} {
      ${fieldDefs}
    }`
}

const typeMapToKotlinEnums = (typeMap: ITypeMap) =>
  Object.entries(typeMap.enums)
    .map(([typeName, fields]) => kotlinEnumDef(typeName, fields))
    .join('\n\n')

const typeMapToKotlin = (typeMap: ITypeMap) =>
  typeMapToKotlinTypes(typeMap) + '\n\n' + typeMapToKotlinEnums(typeMap)

export const graphqlSchemaToKotlin = (schema: string) =>
  typeMapToKotlin(buildBaseTypes(schema))

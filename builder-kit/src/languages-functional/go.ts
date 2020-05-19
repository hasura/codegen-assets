import { ScalarTypes, Fieldlike, ITypeMap } from '../types'
import { serialize, isScalar, capitalize } from '../utils'
import { buildBaseTypes } from '../schemaTools'
import { html as template } from 'common-tags'
import { EnumValueDefinitionApi, ScalarTypeApi } from 'graphql-extra'

const scalarMap = {
  [ScalarTypes.ID]: `int`,
  [ScalarTypes.INT]: `int`,
  [ScalarTypes.FLOAT]: `float32`,
  [ScalarTypes.STRING]: `string`,
  [ScalarTypes.BOOLEAN]: `bool`,
}

export const fieldFormatter = (field: Fieldlike) => {
  let { name, required, list, type } = serialize(field)
  let T = isScalar(type) ? scalarMap[type] : type
  if (!required) T = `*${T}`
  if (list) T = `[]${T}`
  return { name, type: T }
}
const goTypeDef = (typeName, fields: Fieldlike[]) => {
  const fieldDefs = fields
    .map(fieldFormatter)
    .map(({ name, type }) => `${capitalize(name)} ${type}`)
    .join('\n')

  return template`
    type ${typeName} struct {
        ${fieldDefs}
    }
  `
}

const typeMapToGoTypes = (typeMap: ITypeMap) =>
  Object.entries(typeMap.types)
    .map(([typeName, fields]) => goTypeDef(typeName, fields))
    .join('\n\n')

// type LeaveType string
// const(
//   AnnualLeave LeaveType = "AnnualLeave"
//   Sick = "Sick"
//   BankHoliday = "BankHoliday"
//   Other = "Other"
// )
const goEnumDef = (typeName, fields: EnumValueDefinitionApi[]) => {
  const fieldDefs = fields
    .map((field, idx) =>
      idx == 0
        ? `${capitalize(field.getName())} ${typeName} = "${capitalize(
            field.getName()
          )}"`
        : `${capitalize(field.getName())} = "${capitalize(field.getName())}"`
    )
    .join('\n')

  return template`
    type ${typeName} string

    const(
        ${fieldDefs}
    )
  `
}

const goScalarDef = (scalarType: ScalarTypeApi) =>
  `type ${capitalize(scalarType.getName())} string`

const typeMapToGoEnums = (typeMap: ITypeMap) =>
  Object.entries(typeMap.enums)
    .map(([typeName, fields]) => goEnumDef(typeName, fields))
    .join('\n\n')

const typeMapToGoScalars = (typeMap: ITypeMap) =>
  Object.entries(typeMap.scalars)
    .map(([_, scalarType]) => goScalarDef(scalarType))
    .join('\n\n')

const typeMapToGo = (typeMap: ITypeMap) =>
  typeMapToGoScalars(typeMap) +
  '\n\n' +
  typeMapToGoEnums(typeMap) +
  '\n\n' +
  typeMapToGoTypes(typeMap)

export const graphqlSchemaToGo = (schema: string) =>
  typeMapToGo(buildBaseTypes(schema))

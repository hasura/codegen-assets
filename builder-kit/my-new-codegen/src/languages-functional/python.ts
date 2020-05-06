import { ScalarTypes, Fieldlike, ITypeMap } from '../types'
import { indent, serialize, isScalar } from '../utils'
import { buildBaseTypes } from '../schemaTools'
import { html as template } from 'common-tags'
import { EnumValueDefinitionApi } from 'graphql-extra'

const scalarMap = {
  [ScalarTypes.ID]: `int`,
  [ScalarTypes.INT]: `int`,
  [ScalarTypes.FLOAT]: `float`,
  [ScalarTypes.STRING]: `str`,
  [ScalarTypes.BOOLEAN]: `bool`,
}

const baseTypes = template`
  from dataclasses import dataclass
  from typing import List, Optional
  from enum import Enum, auto
`
const fieldFormatter = (field: Fieldlike) => {
  let { name, required, list, type } = serialize(field)
  let T = isScalar(type) ? scalarMap[type] : type
  // str -> List[str]
  if (list) T = `List[${T}]`
  // List[str] -> Optional[List[str]]
  if (!required) T = `Optional[${T}]`
  return { name, type: T }
}
const pythonTypeDef = (typeName: string, fields: Fieldlike[]): string => {
  const fieldDefs = fields
    .map(fieldFormatter)
    .map(({ name, type }) => indent(`${name}: ${type}`))
    .join('\n')

  return template`
      @dataclass
      class ${typeName}:
      ${fieldDefs}
    `
}

const typeMapToPythonTypes = (typeMap: ITypeMap) =>
  Object.entries(typeMap.types)
    .map(([typeName, fields]) => pythonTypeDef(typeName, fields))
    .join('\n\n')

const pythonEnumDef = (
  typeName: string,
  fields: EnumValueDefinitionApi[]
): string => {
  const fieldDefs = fields
    .map((field) => indent(`${field.getName()} = auto()`))
    .join('\n')

  return template`
      class ${typeName}(Enum):
      ${fieldDefs}
    `
}

const typeMapToPythonEnums = (typeMap: ITypeMap) =>
  Object.entries(typeMap.enums)
    .map(([typeName, fields]) => pythonEnumDef(typeName, fields))
    .join('\n\n')

const typeMapToPython = (typeMap: ITypeMap) => {
  let typeDefs =
    baseTypes +
    '\n\n' +
    typeMapToPythonTypes(typeMap) +
    '\n\n' +
    typeMapToPythonEnums(typeMap)

  // Python can't handle type-aliases or standalone type-defs, so we need to replace them post-fact
  Object.keys(typeMap.scalars).forEach((scalar) => {
    typeDefs = typeDefs.replace(new RegExp(scalar, 'g'), 'Any')
  })

  return typeDefs
}

export const graphqlSchemaToPython = (schema: string) =>
  typeMapToPython(buildBaseTypes(schema))

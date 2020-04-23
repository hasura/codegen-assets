import { ScalarTypes, Fieldlike, ITypeMap2 } from '../types'
import { indent, serialize, isScalar2 } from '../utils'
import { buildBaseTypes } from '../schemaTools'
import { html as template } from 'common-tags'
import VerEx from 'verbal-expressions'
import { EnumValueApi } from 'graphql-extra'

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
  let T = isScalar2(type) ? scalarMap[type] : type
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

const typeMapToPythonTypes = (typeMap: ITypeMap2) =>
  Object.entries(typeMap.types)
    .map(([typeName, fields]) => pythonTypeDef(typeName, fields))
    .join('\n\n')

const pythonEnumDef = (typeName: string, fields: EnumValueApi[]): string => {
  const fieldDefs = fields
    .map((field) => indent(`${field.getName()} = auto()`))
    .join('\n')

  return template`
      class ${typeName}(Enum):
      ${fieldDefs}
    `
}

const typeMapToPythonEnums = (typeMap: ITypeMap2) =>
  Object.entries(typeMap.enums)
    .map(([typeName, fields]) => pythonEnumDef(typeName, fields))
    .join('\n\n')

const typeMapToPython = (typeMap: ITypeMap2) =>
  baseTypes +
  '\n\n' +
  typeMapToPythonTypes(typeMap) +
  '\n\n' +
  typeMapToPythonEnums(typeMap)

export const graphqlSchemaToPython = (schema: string) =>
  typeMapToPython(buildBaseTypes(schema))

/**
 * VerbalExpressions match for attributes like the "int" and "another" lines below
 * @dataclass
 * class MyClass:
 *   something: int
 *   another: Optional[List[str]]
 */
// prettier-ignore
const classAttributeRegex =
  VerEx().lineBreak().whitespace().oneOrMore()
    .word(/* my_attribute */).then(':').whitespace().word().maybe('[')
        .maybe(VerEx().word(/* Optional[List[str]] */))
    .maybe(']')
    .maybe(" = None")

/**
 * VerbalExpressions match for entire Mutation/Query Dataclass
 * @dataclass
 * class Mutation:
 *   MyHasuraAction: Optional[MyType]
 */
// prettier-ignore
const mutationOrQueryDataClassRegex =
  VerEx().find('@dataclass').lineBreak()
    .then('class ').maybe('Mutation:').maybe('Query:')
    .then(classAttributeRegex).oneOrMore()

// This still doesn't really work, need to build a directed acyclic graph of type-dependencies or something to get proper order
const postFormat = (typeDefs) => {
  const match = mutationOrQueryDataClassRegex.exec(typeDefs)
  // If found, replace the definition at the top with empty string, then append to end
  if (match) {
    const [dataClassText] = match
    typeDefs = typeDefs.replace(dataClassText, '') + '\n\n' + dataClassText
  }
  return typeDefs
}

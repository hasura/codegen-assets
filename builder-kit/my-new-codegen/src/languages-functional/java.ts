import { ScalarTypes, ITypeMap, Fieldlike } from '../types'
import { isScalar, serialize } from '../utils'
import { buildBaseTypes } from '../schemaTools'
import { html as template } from 'common-tags'
import { EnumValueDefinitionApi } from 'graphql-extra'

const scalarMap = {
  [ScalarTypes.ID]: `Integer`,
  [ScalarTypes.INT]: `Integer`,
  [ScalarTypes.FLOAT]: `Float`,
  [ScalarTypes.STRING]: `String`,
  [ScalarTypes.BOOLEAN]: `Boolean`,
}

const fieldFormatter = (field: Fieldlike) => {
  let { name, required, list, type } = serialize(field)
  let T = isScalar(type) ? scalarMap[type] : type
  // String? -> List<String?>
  if (list) T = `Iterable<${T}>`
  return { name, type: T }
}

const javaTypeDef = (typeName: string, fields: Fieldlike[]): string => {
  const fieldDefs = fields
    .map(fieldFormatter)
    .map(
      ({ name, type }) => template`
      private ${type} _${name};
      public ${type} get${name}() { return this._${name}; }
    `
    )
    .join('\n\n')

  return template`
    public class ${typeName} {
      ${fieldDefs}
    }`
}

const typeMapTojavaTypes = (typeMap: ITypeMap) =>
  Object.entries(typeMap.types)
    .map(([typeName, fields]) => javaTypeDef(typeName, fields))
    .join('\n\n')

// const javaEnumDef = (typeName: string, fields: EnumValueDefinitionApi[]): string => {
//   const fieldDefs = fields.map((field) => field.getName()).join(', ')

//   return template`
//     enum class ${typeName} {
//       ${fieldDefs}
//     }`
// }

// const typeMapTojavaEnums = (typeMap: ITypeMap) =>
//   Object.entries(typeMap.enums)
//     .map(([typeName, fields]) => javaEnumDef(typeName, fields))
//     .join('\n\n')

// const typeMapTojava = (typeMap: ITypeMap) =>
//   typeMapTojavaTypes(typeMap) + '\n\n' + typeMapTojavaEnums(typeMap)

export const graphqlSchemaTojava = (schema: string) =>
  typeMapTojavaTypes(buildBaseTypes(schema))

const schema = `
  type Mutation {
    InsertUserAction(user_info: UserInfo!): TokenOutput
  }

  enum SOME_ENUM {
    TYPE_A
    TYPE_B
    TYPE_C
  }

  input UserInfo {
    username: String!
    password: String!
    enum_field: SOME_ENUM!
    nullable_field: Float
    nullable_list: [Int]
  }

  type TokenOutput {
    accessToken: String!
  }
`

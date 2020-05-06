import { ObjectTypeDefinitionNode, ScalarTypeDefinitionNode } from 'graphql'
import { ActionParams, ITypeMap, ScalarTypes } from './types'
import { isScalar } from './utils'
import {
  t,
  documentApi,
  FieldDefinitionApi,
  DocumentApi,
  InputTypeApi,
  ObjectTypeApi,
} from 'graphql-extra'
import { graphqlSchemaToTypescript } from './languages-functional/typescript'

const nonDerivedSDL = `
  type Mutation {
    InsertUserAction(user_info: UserInfo!): UserOutput
  }

  enum SOME_ENUM {
    TYPE_A
    TYPE_B
    TYPE_C
  }

  scalar Email

  input UserInfo {
    username: String!
    password: String!
    email: Email!
    age: Int
    birthDate: timestamptz!
    enum_field: SOME_ENUM!
    nullable_field: Float
    nullable_list: [Int]
  }

  type UserOutput {
    accessToken: String!
    age: Int
    email: Email!
    birthDate: timestamptz
  }
`

/**
 * Takes an argument from Action field in Schema
 * and converts it to an object type + adds to document
 * To codegen the Action's input parameter types later
 */
const makeActionArgType = (
  field: FieldDefinitionApi
): ObjectTypeDefinitionNode =>
  t.objectType({
    name: field.getName() + 'Args',
    fields: field.getArguments().map((arg) => arg.toField().node),
  })

/**
 * Maps through the Mutation fields to grab Action and creates types
 * in the schema document for each of them for codegen
 */
export const addActionArgumentTypesToSchema = (document: DocumentApi) => {
  document
    .getObjectType(getActionType(document))
    .getFields()
    .forEach((field) => {
      const actionArgType = makeActionArgType(field)
      document.createObjectType(actionArgType)
    })
  return document
}

const addMissingScalars = (
  document: DocumentApi,
  type: ObjectTypeApi | InputTypeApi
) =>
  type.getFields().forEach((f) => {
    const fieldTypename = f.getTypename()
    if (document.hasType(fieldTypename) || isScalar(fieldTypename)) return
    document.createScalarType({ name: fieldTypename })
  })

const populatePostgresScalars = (document: DocumentApi) => {
  document
    .getAllObjectTypes()
    .forEach((type) => addMissingScalars(document, type))
  document
    .getAllInputTypes()
    .forEach((type) => addMissingScalars(document, type))
  return document
}
/**
 * Takes a Document API object and builds a map of it's types and their fields
 */
function buildTypeMap(document: DocumentApi): ITypeMap {
  let res: ITypeMap = {
    types: {},
    enums: {},
    scalars: {},
  }
  // consider a field type to be postgres scalar if it is not found in the doc
  populatePostgresScalars(document)

  for (let type of document.getAllTypes()) {
    const name = type.getName()
    switch (true) {
      case type.isInputType():
        const inputFields = type.assertInputType().getFields()
        res.types[name] = inputFields
        break
      case type.isObjectType():
        const objectFields = type.assertObjectType().getFields()
        res.types[name] = objectFields
        break
      case type.isEnumType():
        res.enums[name] = type.assertEnumType().getValues()
        break
      case type.isScalarType():
        res.scalars[name] = type.assertScalarType()
        break
    }
  }

  return res
}

type ActionType = 'Mutation' | 'Query'

/**
 * Returns whether the Action is a Query or Mutation
 * Throws error if neither found
 */
const getActionType = (doc: DocumentApi): ActionType => {
  if (doc.hasType('Query')) return 'Query'
  if (doc.hasType('Mutation')) return 'Mutation'
  else throw new Error('Neither Mutation or Query found in Document SDL')
}

/**
 *
 * @param {string} actionName
 * @param {string} actionSdl
 * @returns {ActionParams} actionParams
 */
export function buildActionTypes(
  actionName: string,
  sdl: string
): ActionParams {
  // Remove the "extend" directive from mutation/query types so they work properly
  // The console converts regular Mutation/Query types into extend type Mutation/Query
  // which do not appear in the document Typemap and break the functionality.
  const convertedSdl = removeExtendDirectives(sdl)
  const document = documentApi().addSDL(convertedSdl)
  addActionArgumentTypesToSchema(document)

  const actionType = getActionType(document)
  const action = document.getObjectType(actionType).getField(actionName)

  let actionParams: ActionParams = {
    actionName: actionName,
    returnType: action.getTypename(),
    actionArgs: action.getArguments(),
    typeMap: buildTypeMap(document),
  }

  return actionParams
}

/**
 * Function that allows TypeConverters to generate TypeMap's for non-Hasura Action SDL
 * In TypeConverter constructor, it checks whether it should generate
 */
export function buildBaseTypes(
  sdl: string,
  makeActionArgTypes: boolean = true
) {
  // Remove the "extend" directive from mutation/query types so they work properly
  // The console converts regular Mutation/Query types into extend type Mutation/Query
  // which do not appear in the document Typemap and break the functionality.
  const convertedSdl = removeExtendDirectives(sdl)
  const document = documentApi().addSDL(convertedSdl)
  if (makeActionArgTypes) addActionArgumentTypesToSchema(document)
  return buildTypeMap(document)
}

/**
 * We need this because "extend" removes the type from the Typemap
 * so we trim it and pretend it's just a regular Mutation/Query
 */
export const removeExtendDirectives = (sdl: string) =>
  sdl.replace(/extend/g, '')

import { ObjectTypeDefinitionNode } from 'graphql'
import { ActionParams, ITypeMap2 } from './types'
import {
  t,
  documentApi,
  objectTypeApi,
  FieldDefinitionApi,
  DocumentApi,
  inputTypeApi,
  enumValueApi,
  enumTypeApi,
} from 'graphql-extra'

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
    fields: field.getArguments().map((arg) => arg.node),
  })

/**
 * Maps through the Mutation fields to grab Action and creates types
 * in the schema document for each of them for codegen
 */
export const addActionArgumentTypesToSchema = (document: DocumentApi) =>
  document
    .getObjectType(getActionType(document))
    .getFields()
    .forEach((field) => {
      const actionArgType = makeActionArgType(field)
      document.createObjectType(actionArgType)
    })

/**
 * Takes a Document API object and builds a map of it's types and their fields
 */
function buildTypeMap(document: DocumentApi): ITypeMap2 {
  let res: ITypeMap2 = {
    types: {},
    enums: {},
  }

  for (let [typeName, astNode] of document.typeMap) {
    switch (astNode.kind) {
      case 'InputObjectTypeDefinition':
        res['types'][typeName] = inputTypeApi(astNode).getFields()
        break
      case 'ObjectTypeDefinition':
        res['types'][typeName] = objectTypeApi(astNode).getFields()
        break
      case 'EnumTypeDefinition':
        res['enums'][typeName] = enumTypeApi(astNode).node.values.map(
          enumValueApi
        )
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
  const document = documentApi().addSDL(sdl)
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
  const document = documentApi().addSDL(sdl)
  if (makeActionArgTypes) addActionArgumentTypesToSchema(document)
  return buildTypeMap(document)
}

import { ObjectTypeDefinitionNode, EnumValueDefinitionNode } from 'graphql'
import { IField, ITypeMap, ActionParams } from './types'
import {
  t,
  documentApi,
  ObjectTypeApi,
  objectTypeApi,
  FieldDefinitionApi,
  DocumentApi,
  TypeApi,
  inputTypeApi,
  enumValueApi,
  enumTypeApi,
  InputValueApi,
} from 'graphql-extra'

const serializeFieldType = (typeName: string, typeNode: TypeApi) => ({
  name: typeName,
  type: typeNode.getTypename(),
  required: typeNode.isNonNull(),
  list: typeNode.isList(),
})

/**
 * Takes a Field from graphql-extra's FieldDefinitionApi and serializes it
 * to extract and format the important information:
 * Name, Type, Nullability, and whether it's a list
 * @param {FieldDefinitionApi} field
 * @returns {IField}
 */
const serializeField = (field: FieldDefinitionApi | InputValueApi): IField => ({
  name: field.getName(),
  type: serializeFieldType(field.getTypename(), field.getType()),
  required: field.isNonNullType(),
})

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
const addActionArgumentTypesToSchema = (document: DocumentApi) =>
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
function buildTypeMap(document: DocumentApi): ITypeMap {
  let res = {
    types: {},
    enums: {},
  }

  for (let [typeName, astNode] of document.typeMap) {
    switch (astNode.kind) {
      case 'InputObjectTypeDefinition':
        res['types'][typeName] = inputTypeApi(astNode)
          .getFields()
          .map(serializeField)
        break
      case 'ObjectTypeDefinition':
        res['types'][typeName] = objectTypeApi(astNode)
          .getFields()
          .map(serializeField)
        break
      case 'EnumTypeDefinition':
        res['enums'][typeName] = enumTypeApi(astNode).node.values.map(
          serializeEnumValue
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
 * Gets the fields of a GraphQL Object-type and map through them to serialize format
 */
const mapSerializeFields = (node: ObjectTypeApi) =>
  node.getFields().map(serializeField)

const serializeEnumValue = (node: EnumValueDefinitionNode) => {
  const value = enumValueApi(node).getName()
  return { value }
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
  const actionArgType = document.getObjectType(actionName + 'Args')

  let typeMap: ActionParams = {
    actionName: actionName,
    returnType: action.getTypename(),
    actionArgs: mapSerializeFields(actionArgType),
    types: buildTypeMap(document),
  }

  return typeMap
}

/**
 * Function that allows TypeConverters to generate TypeMap's for non-Hasura Action SDL
 * In TypeConverter constructor, it checks whether it should generate
 */
export function buildBaseTypes(
  sdl: string,
  makeActionArgTypes: boolean = false
) {
  const document = documentApi().addSDL(sdl)
  if (makeActionArgTypes) {
    addActionArgumentTypesToSchema(document)
  }
  return buildTypeMap(document)
}

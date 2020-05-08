import { ObjectTypeDefinitionNode } from 'graphql'
import { ActionParams, ITypeMap } from './types'
import { pipe, isScalar } from './utils'
import {
  t,
  documentApi,
  FieldDefinitionApi,
  DocumentApi,
  InputTypeApi,
  ObjectTypeApi,
} from 'graphql-extra'

/**
 * Takes an argument from Action field in Schema
 * and converts it to an object type + adds to document
 * To codegen the Action's input parameter types later
 */
const _makeActionArgType = (
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
export function addArgumentTypesToSchema(document: DocumentApi) {
  document
    .getAllObjectTypes()
    .filter((type) => type.getName() == 'Mutation' || type.getName() == 'Query')
    .forEach((type) => {
      type.getFields().forEach((field) => {
        document.createObjectType(_makeActionArgType(field))
      })
    })
  return document
}

const _addMissingScalarsForType = (
  document: DocumentApi,
  type: ObjectTypeApi | InputTypeApi
) =>
  type.getFields().forEach((f) => {
    const fieldTypename = f.getTypename()
    if (document.hasType(fieldTypename) || isScalar(fieldTypename)) return
    document.createScalarType({ name: fieldTypename })
  })

const populateCustomScalars = (document: DocumentApi) => {
  document
    .getAllObjectTypes()
    .forEach((type) => _addMissingScalarsForType(document, type))
  document
    .getAllInputTypes()
    .forEach((type) => _addMissingScalarsForType(document, type))
  return document
}
/**
 * Takes a Document API object and builds a map of it's types and their fields
 */
export function buildTypeMap(document: DocumentApi): ITypeMap {
  let res: ITypeMap = { types: {}, enums: {}, scalars: {} }

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
  const document = processSchema(sdl)

  // The current Action is found by:
  // - Iterating through all the Object Extension types
  //   (since we use "extend type Query/Mutation")
  // - Finding the one that has a field with current Action name
  // - Then returning that field from the Operation (Mutation/Query) type
  const action = document
    .getAllObjectTypes()
    .find((type) => type._fields.has(actionName))
    .getField(actionName)

  let actionParams: ActionParams = {
    actionName: actionName,
    returnType: action.getTypename(),
    actionArgs: action.getArguments(),
    typeMap: buildTypeMap(document),
  }

  return actionParams
}

/**
 * Converts "extend type Mutation" and "extend type Query" definitions
 * into fields on root Mutation/Query types in the Document
 */
function convertExtendedQueriesAndMutations(document: DocumentApi) {
  document.upsertObjectType(t.queryType({}))
  document.upsertObjectType(t.mutationType({}))

  const queries = document.getObjectType('Query')
  const mutations = document.getObjectType('Mutation')

  document.getAllObjectExts().forEach((extendedType) => {
    extendedType.getFields().forEach((field) => {
      const operation = extendedType.getName()
      if (operation == 'Query') queries.upsertField(field.node)
      if (operation == 'Mutation') mutations.upsertField(field.node)
    })
  })

  const queryFields = queries.getFields()
  const mutationFields = mutations.getFields()

  if (!queryFields.length) document.removeObjectType('Query')
  if (!mutationFields.length) document.removeObjectType('Mutation')

  return document
}

/**
 * Function that allows TypeConverters to generate TypeMap's for non-Hasura Action SDL
 * In TypeConverter constructor, it checks whether it should generate
 */
export const buildBaseTypes = (sdl: string) => buildTypeMap(processSchema(sdl))

/**
 * Converts a GraphQL Schema SDL string into a Document API
 * while also processing it.
 *
 * Converts `extend type Query/Mutation` into regular types,
 * creates types for each operation's inputs/arguments, and
 * creates definitions for any custom scalars not in the schema.
 */
export function processSchema(sdl: string): DocumentApi {
  const document = documentApi().addSDL(sdl)
  const process = pipe(
    convertExtendedQueriesAndMutations,
    addArgumentTypesToSchema,
    populateCustomScalars
  )
  return process(document)
}

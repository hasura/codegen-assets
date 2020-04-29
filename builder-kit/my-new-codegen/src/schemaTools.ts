import {
  ObjectTypeDefinitionNode,
  ScalarTypeDefinitionNode
} from 'graphql'
import { ActionParams, ITypeMap, ScalarTypes } from './types'
import { isScalar } from './utils'
import {
  t,
  documentApi,
  objectTypeApi,
  FieldDefinitionApi,
  InputValueApi,
  ScalarTypeApi,
  DocumentApi,
  inputTypeApi,
  enumValueApi,
  enumTypeApi,
  scalarTypeApi,
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

export const createScalarTypeDefinitioNode = (
  name: string,
  description?: string
) => {
  const node: ScalarTypeDefinitionNode = {
    kind: "ScalarTypeDefinition",
    name: {
      kind: "Name",
      value: name,
    },
    description: description ? {
      kind: "StringValue",
      value: description,
    } : null
  }
  return node;
};

/**
 * Takes a Document API object and builds a map of it's types and their fields
 */
function buildTypeMap(document: DocumentApi): ITypeMap {
  let res: ITypeMap = {
    types: {},
    enums: {},
    scalars: {}
  }

  // get a map of all types in the document
  const allTypes: Record <string, any> = {};
  document.typeMap.forEach(t => {
    allTypes[t.name.value] = true;
  });

  // consider a field type to be postgres scalar if it is not found in the doc
  const populatePostgresScalars = (fields: (InputValueApi | FieldDefinitionApi)[]) => {
    fields.forEach(f => {
      const fieldTypename = f.getType().getTypename();
      if(!allTypes[fieldTypename] && !isScalar(fieldTypename)) {
        const newScalarApi = scalarTypeApi(createScalarTypeDefinitioNode(fieldTypename))
        res.scalars[fieldTypename] = newScalarApi;
        allTypes[fieldTypename] = true
      }
    })
  }

  for (let [typeName, astNode] of document.typeMap) {
    switch (astNode.kind) {
      case 'InputObjectTypeDefinition': {
        const fields = inputTypeApi(astNode).getFields();
        populatePostgresScalars(fields);
        res['types'][typeName] = fields
        break
      }
      case 'ObjectTypeDefinition': {
        const fields = objectTypeApi(astNode).getFields();
        populatePostgresScalars(fields);
        res['types'][typeName] = fields
        break
      }
      case 'EnumTypeDefinition': {
        res['enums'][typeName] = enumTypeApi(astNode).node.values.map(
          enumValueApi
        )
        break
      }
      case 'ScalarTypeDefinition': {
        res['scalars'][typeName] = scalarTypeApi(astNode)
        break;
      }
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

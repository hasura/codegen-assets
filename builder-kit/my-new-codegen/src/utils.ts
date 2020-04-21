import { ITypeNode, ScalarTypes } from './types'
import { parse } from 'graphql';

export const NEWLINE = '\n'
const SPACE = ' '

export const indent = (string, tabSize = 2) => SPACE.repeat(tabSize) + string

/**
 * Checks if type string exists in ScalarMap
 */
export const isScalar = (type: ITypeNode) => {
  return type?.name?.toUpperCase() in ScalarTypes
}

/**
 * Returns the first root field from an operation
 * Ex: Returns "user" if the operation is "query { user { id name } articles { title content } }"
 */
export const getRootFieldName = (operationString: string) => {
  const doc = parse(operationString);
  const operation: any = doc.definitions[0];
  const selection = operation.selectionSet.selections[0];
  return selection.alias ? selection.alias.value : selection.name.value;
};
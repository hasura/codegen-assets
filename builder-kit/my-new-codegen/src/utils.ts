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
 * Capitalizes a string
 */
export const capitalize = (str: string) => {
  if (!str.length) return str;
  return str[0].toUpperCase() + str.substring(1);
}

/**
 * Returns the first root field from an operation
 * Ex: Returns "user" if the operation is "query { user { id name } articles { title content } }"
 */
export const getRootFieldName = (operationString: string, shouldCapitalize=false) => {
  const doc = parse(operationString);
  const operation: any = doc.definitions[0];
  const selection = operation.selectionSet.selections[0];
  const name: string = selection.alias ? selection.alias.value : selection.name.value;
  return shouldCapitalize ? capitalize(name): name;
};

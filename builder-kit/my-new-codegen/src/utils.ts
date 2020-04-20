import { ITypeNode, ScalarTypes } from './types'

export const NEWLINE = '\n'
const SPACE = ' '

export const indent = (string, tabSize = 2) => SPACE.repeat(tabSize) + string

/**
 * Checks if type string exists in ScalarMap
 */
export const isScalar = (type: ITypeNode) => {
  return type?.name?.toUpperCase() in ScalarTypes
}

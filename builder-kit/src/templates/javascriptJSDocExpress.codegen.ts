import { graphqlSchemaToJSDoc } from '../languages-functional/jsdoc'
import { javascriptExpressTemplate } from './javascriptJSDocExpress'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const codegen = javascriptExpressTemplate({ ...actionParams, derive })
  const response = [
    {
      name: actionName + '.js',
      content: codegen,
    },
    {
      name: actionName + 'Types.js',
      content: graphqlSchemaToJSDoc(actionSdl),
    },
  ]
  return response
}

globalThis.templater = templater

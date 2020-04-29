import { graphqlSchemaToJSDoc } from '../languages-functional'
import { javascriptExpressTemplate } from '../templates'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const templateParams = { ...actionParams, derive }

  const codegen = javascriptExpressTemplate({
    ...templateParams,
    typeDefs: graphqlSchemaToJSDoc(actionSdl),
  })

  const response = [
    {
      name: actionName + 'JavascriptJSDocExpress.js',
      content: codegen,
    },
  ]

  return response
}

globalThis.templater = templater

import { graphqlSchemaToTypescript } from '../languages-functional'
import { typescriptExpressTemplate } from '../templates'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const templateParams = { ...actionParams, derive }

  const codegen = typescriptExpressTemplate({
    ...templateParams,
    typeDefs: graphqlSchemaToTypescript(actionSdl),
  })

  const response = [
    {
      name: actionName + 'TypescriptExpress.ts',
      content: codegen,
    },
  ]

  return response
}

globalThis.templater = templater

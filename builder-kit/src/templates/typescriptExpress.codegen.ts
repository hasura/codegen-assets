import { graphqlSchemaToTypescript } from '../languages-functional/typescript'
import { typescriptExpressTemplate } from '../templates/typescriptExpress'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const codegen = typescriptExpressTemplate({ ...actionParams, derive })
  const response = [
    {
      name: actionName + '.ts',
      content: codegen,
    },
    {
      name: actionName + 'Types.ts',
      content: graphqlSchemaToTypescript(actionSdl),
    },
  ]
  return response
}

globalThis.templater = templater

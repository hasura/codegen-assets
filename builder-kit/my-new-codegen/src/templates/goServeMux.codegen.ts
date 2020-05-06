import { graphqlSchemaToGo } from '../languages-functional/go'
import { goServeMuxTemplate } from './goServeMux'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const codegen = goServeMuxTemplate({ ...actionParams, derive })
  const response = [
    {
      name: actionName + '.go',
      content: codegen,
    },
    {
      name: actionName + 'Types.go',
      content: graphqlSchemaToGo(actionSdl),
    },
  ]
  return response
}

globalThis.templater = templater

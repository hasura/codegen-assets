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
  const templateParams = { ...actionParams, derive }

  const codegen = goServeMuxTemplate({
    ...templateParams,
    typeDefs: graphqlSchemaToGo(actionSdl),
  })

  const response = [
    {
      name: actionName + 'GoServeMux.go',
      content: codegen,
    },
  ]

  return response
}

globalThis.templater = templater

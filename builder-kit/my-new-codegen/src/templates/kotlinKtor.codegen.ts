import { graphqlSchemaToKotlin } from '../languages-functional/kotlin'
import { kotlinKtorTemplate } from './kotlinKtor'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const codegen = kotlinKtorTemplate({ ...actionParams, derive })
  const response = [
    {
      name: actionName + '.kt',
      content: codegen,
    },
    {
      name: actionName + 'Types.kt',
      content: graphqlSchemaToKotlin(actionSdl),
    },
  ]
  return response
}

globalThis.templater = templater

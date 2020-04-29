import { graphqlSchemaToKotlin } from '../languages-functional'
import { kotlinKtorTemplate } from '../templates'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const templateParams = { ...actionParams, derive }

  const codegen = kotlinKtorTemplate({
    ...templateParams,
    typeDefs: graphqlSchemaToKotlin(actionSdl),
  })

  const response = [
    {
      name: actionName + 'KotlinKtor.kt',
      content: codegen,
    },
  ]

  return response
}

globalThis.templater = templater

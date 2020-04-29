import { graphqlSchemaToKotlin } from '../languages-functional'
import { kotlinHttp4kTemplate } from '../templates'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const templateParams = { ...actionParams, derive }

  const codegen = kotlinHttp4kTemplate({
    ...templateParams,
    typeDefs: graphqlSchemaToKotlin(actionSdl),
  })

  const response = [
    {
      name: actionName + 'KotlinHttp4k.kt',
      content: codegen,
    },
  ]

  return response
}

globalThis.templater = templater

import { graphqlSchemaTojava } from '../languages-functional'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'
import { javaSpringBootTemplate } from './javaSpringBoot'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const templateParams = { ...actionParams, derive }

  const codegen = javaSpringBootTemplate({
    ...templateParams,
    typeDefs: graphqlSchemaTojava(actionSdl),
  })

  const response = [
    {
      name: actionName + 'JavaSpringBoot.java',
      content: codegen,
    },
  ]

  return response
}

globalThis.templater = templater

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
  const codegen = javaSpringBootTemplate({ ...actionParams, derive })
  const response = [
    {
      name: actionName + '.java',
      content: codegen,
    },
    {
      name: actionName + 'Types.java',
      content: graphqlSchemaTojava(actionSdl),
    },
  ]
  return response
}

globalThis.templater = templater

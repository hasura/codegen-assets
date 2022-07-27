import { graphqlSchemaTojava } from '../languages-functional'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'
import { javaQuarkusTemplate } from './javaQuarkus'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const codegen = javaQuarkusTemplate({ ...actionParams, derive })
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

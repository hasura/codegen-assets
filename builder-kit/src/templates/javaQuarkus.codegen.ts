import { graphqlSchemaTojava } from '../languages-functional'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'
import { javaQuarkusTemplate } from './javaQuarkus'
import { capitalize } from 'src/utils'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const codegen = javaQuarkusTemplate({ ...actionParams, derive })
  const response = [
    {
      name: capitalize(actionName) + '.java',
      content: codegen,
    },
    {
      name: capitalize(actionName) + 'Types.java',
      content: graphqlSchemaTojava(actionSdl),
    },
  ]
  return response
}

globalThis.templater = templater

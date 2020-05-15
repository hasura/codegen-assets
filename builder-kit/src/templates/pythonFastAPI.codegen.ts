import { graphqlSchemaToPython } from '../languages-functional'
import { pythonFastAPITemplate } from '../templates'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const codegen = pythonFastAPITemplate({ ...actionParams, derive })
  const response = [
    {
      name: actionName + '.py',
      content: codegen,
    },
    {
      name: actionName + 'Types.py',
      content: graphqlSchemaToPython(actionSdl),
    },
  ]
  return response
}

globalThis.templater = templater

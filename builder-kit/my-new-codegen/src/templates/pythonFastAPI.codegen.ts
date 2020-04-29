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
  const templateParams = { ...actionParams, derive }

  const codegen = pythonFastAPITemplate({
    ...templateParams,
    typeDefs: graphqlSchemaToPython(actionSdl),
  })

  const response = [
    {
      name: actionName + 'PythonFastAPI.py',
      content: codegen,
    },
  ]

  return response
}

globalThis.templater = templater

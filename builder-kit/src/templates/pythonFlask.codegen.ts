import { graphqlSchemaToPython } from '../languages-functional/python'
import { pythonFlaskTemplate } from './pythonFlask'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const codegen = pythonFlaskTemplate({ ...actionParams, derive })
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

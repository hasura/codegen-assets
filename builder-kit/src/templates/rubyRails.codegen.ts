import { rubyRailsTemplate } from './rubyRails'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const codegen = rubyRailsTemplate({ ...actionParams, derive })
  const response = [
    {
      name: actionName + '.rb',
      content: codegen,
    },
  ]
  return response
}

globalThis.templater = templater

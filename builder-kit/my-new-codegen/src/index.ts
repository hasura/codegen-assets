import {
  graphqlSchemaToJSDoc,
  graphqlSchemaToTypescript,
  graphqlSchemaToGo,
  graphqlSchemaToPython,
  graphqlSchemaToKotlin,
} from './languages-functional'

import {
  javascriptExpressTemplate,
  typescriptExpressTemplate,
  kotlinHttp4kTemplate,
  kotlinKtorTemplate,
  pythonFastAPITemplate,
  goServeMuxTemplate,
} from './templates'

import { buildActionTypes } from './schemaTools'
import { DeriveParams } from './types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const templateParams = { ...actionParams, derive }
  /**
   * Javascript
   */
  const jsCodegen = javascriptExpressTemplate({
    ...templateParams,
    typeDefs: graphqlSchemaToJSDoc(actionSdl),
  })

  /**
   * Typescript
   */
  const tsCodegen = typescriptExpressTemplate({
    ...templateParams,
    typeDefs: graphqlSchemaToTypescript(actionSdl),
  })

  /**
   * Go
   */
  const goCodegen = goServeMuxTemplate({
    ...templateParams,
    typeDefs: graphqlSchemaToGo(actionSdl),
  })

  /**
   * Python
   */
  const pythonCodeGen = pythonFastAPITemplate({
    ...templateParams,
    typeDefs: graphqlSchemaToPython(actionSdl),
  })

  /**
   * Kotlin
   */
  const kotlinTypes = graphqlSchemaToKotlin(actionSdl)
  const kotlinHttp4kCodegen = kotlinHttp4kTemplate({
    ...templateParams,
    typeDefs: kotlinTypes,
  })
  const kotlinKtorCodegen = kotlinKtorTemplate({
    ...templateParams,
    typeDefs: kotlinTypes,
  })

  /**
   * Response
   */
  const response = [
    {
      name: actionName + 'TypescriptExpress.ts',
      content: tsCodegen,
    },
    {
      name: actionName + 'JavascriptJSDocExpress.js',
      content: jsCodegen,
    },
    {
      name: actionName + 'GoServeMux.go',
      content: goCodegen,
    },
    {
      name: actionName + 'PythonFastAPI.py',
      content: pythonCodeGen,
    },
    {
      name: actionName + 'KotlinHttp4k.kt',
      content: kotlinHttp4kCodegen,
    },
    {
      name: actionName + 'KotlinKtor.kt',
      content: kotlinKtorCodegen,
    },
  ]
  return response
}

globalThis.templater = templater

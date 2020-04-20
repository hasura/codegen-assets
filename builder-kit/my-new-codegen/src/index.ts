import {
  JSDocTypeConverter,
  TSTypeConverter,
  GoTypeConverter,
  PythonTypeConverter,
  KotlinTypeConverter,
} from './languages'

import {
  javascriptExpressTemplate,
  typescriptExpressTemplate,
  kotlinHttp4kTemplate,
  kotlinKtorTemplate,
  pythonFastAPITemplate,
  goServeMuxTemplate,
} from './templates'

import { buildActionTypes } from './schemaTools'

const templater = (actionName, actionSdl, derive) => {
  const actionParams = buildActionTypes(actionName, actionSdl)

  /**
   * Javascript
   */
  const jsTypeConverter = new JSDocTypeConverter({
    actionName,
    schema: actionSdl,
  })
  const jsCodegen = javascriptExpressTemplate({
    ...actionParams,
    typeDefs: jsTypeConverter.generateTypes(),
  })

  /**
   * Typescript
   */
  const tsTypeConverter = new TSTypeConverter({
    actionName,
    schema: actionSdl,
  })
  const tsCodegen = typescriptExpressTemplate({
    ...actionParams,
    typeDefs: tsTypeConverter.generateTypes(),
  })

  /**
   * Go
   */
  const goTypeConverter = new GoTypeConverter({
    actionName,
    schema: actionSdl,
  })
  const goCodegen = goServeMuxTemplate({
    ...actionParams,
    typeDefs: goTypeConverter.generateTypes(),
  })

  /**
   * Python
   */
  const pythonTypeConverter = new PythonTypeConverter({
    actionName,
    schema: actionSdl,
  })
  const pythonCodeGen = pythonFastAPITemplate({
    ...actionParams,
    typeDefs: pythonTypeConverter.generateTypes(),
  })

  /**
   * Kotlin
   */
  const kotlinTypeConverter = new KotlinTypeConverter({
    actionName,
    schema: actionSdl,
  })
  const kotlinTypes = kotlinTypeConverter.generateTypes()
  const kotlinHttp4kCodegen = kotlinHttp4kTemplate({
    ...actionParams,
    typeDefs: kotlinTypes,
  })
  const kotlinKtorCodegen = kotlinKtorTemplate({
    ...actionParams,
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

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
  const templateParams = { ...actionParams, derive }

  /**
   * Javascript
   */
  const jsTypeConverter = new JSDocTypeConverter({
    schema: actionSdl,
  })
  const jsCodegen = javascriptExpressTemplate({
    ...templateParams,
    typeDefs: jsTypeConverter.generateTypes(),
  })

  /**
   * Typescript
   */
  const tsTypeConverter = new TSTypeConverter({
    schema: actionSdl,
  })
  const tsCodegen = typescriptExpressTemplate({
    ...templateParams,
    typeDefs: tsTypeConverter.generateTypes(),
  })

  /**
   * Go
   */
  const goTypeConverter = new GoTypeConverter({
    schema: actionSdl,
  })
  const goCodegen = goServeMuxTemplate({
    ...templateParams,
    typeDefs: goTypeConverter.generateTypes(),
  })

  /**
   * Python
   */
  const pythonTypeConverter = new PythonTypeConverter({
    schema: actionSdl,
  })
  const pythonCodeGen = pythonFastAPITemplate({
    ...templateParams,
    typeDefs: pythonTypeConverter.generateTypes(),
  })

  /**
   * Kotlin
   */
  const kotlinTypeConverter = new KotlinTypeConverter({
    schema: actionSdl,
  })
  const kotlinTypes = kotlinTypeConverter.generateTypes()
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

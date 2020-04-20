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

import fs from 'fs'

interface CodegenFile {
  name: string
  content: string
}

const templater = (actionName, actionSdl, derive): CodegenFile[] => {
  const actionParams = buildActionTypes(actionName, actionSdl)

  /**
   * Javascript
   */
  const jsTypeConverter = new JSDocTypeConverter({
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
  const response: CodegenFile[] = [
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

const schemaSource = `
  type Mutation {
    InsertUserAction(user_info: UserInfo!): TokenOutput
  }

  input UserInfo {
    username: String!
    password: String!
  }

  type TokenOutput {
    accessToken: String!
  }
`

const writeCodegenTemplate = (input: CodegenFile) => {
  const fd = fs.openSync(`./CodegenOutput/${input.name}`, 'w')
  fs.writeSync(fd, input.content)
}

const res = templater('InsertUserAction', schemaSource, false)

for (let codegen of res) {
  console.log(codegen.name)
  console.log(codegen.content)
  writeCodegenTemplate(codegen)
}

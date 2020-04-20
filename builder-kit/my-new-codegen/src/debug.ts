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
import { customInsertUserDerive } from './exampleDerivePayload'

import fs from 'fs'
import { DeriveParams } from 'types'

interface CodegenFile {
  name: string
  content: string
}

/**
 * Example Non-Derived Schema, InsertUserAction is non-Derived Action
 */
const nonDerivedSDL = `
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

/**
 * Example Derived Schema, CustomInsertUser is a Derived Action
 * CustomInsertUser has the Derive payload exported from exampleDerivePayload.ts
 * as customInsertUserDerive
 */
const derivedSDL = `
  type Mutation {
    CustomInsertUser(email: String!, name: String!): CustomInsertUserOutput
  }

  type CustomInsertUserOutput {
    email: String!
    id: Int!
    name: String!
  }
`

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

const writeCodegenTemplate = (input: CodegenFile) => {
  const fd = fs.openSync(`./CodegenOutput/${input.name}`, 'w')
  fs.writeSync(fd, input.content)
}

const codegenNonDerived = templater('InsertUserAction', nonDerivedSDL, null)
const codegenDerived = templater(
  'CustomInsertUser',
  derivedSDL,
  customInsertUserDerive
)

for (let codegen of codegenNonDerived) {
  writeCodegenTemplate(codegen)
}

for (let codegen of codegenDerived) {
  codegen.name = 'Derived' + codegen.name
  writeCodegenTemplate(codegen)
}

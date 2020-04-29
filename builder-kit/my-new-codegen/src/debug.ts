import {
  graphqlSchemaToGo,
  graphqlSchemaToJSDoc,
  graphqlSchemaToKotlin,
  graphqlSchemaToPython,
  graphqlSchemaToTypescript,
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
import { customInsertUserDerive } from './exampleDerivePayload'

import fs from 'fs'
import { DeriveParams } from './types'

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

  enum SOME_ENUM {
    TYPE_A
    TYPE_B
    TYPE_C
  }

  scalar Email

  input UserInfo {
    username: String!
    password: String!
    email: Email!
    enum_field: SOME_ENUM!
    nullable_field: Float
    nullable_list: [Int]
  }

  type TokenOutput {
    accessToken: String!
    email: Email!
  }
`

/**
 * Example Derived Schema, CustomInsertUser is a Derived Action
 * CustomInsertUser has the Derive payload exported from exampleDerivePayload.ts
 * as customInsertUserDerive
 */
const derivedSDL = `

  scalar Email

  type Mutation {
    CustomInsertUser(email: Email!, name: String!): CustomInsertUserOutput
  }

  enum SOME_ENUM {
    TYPE_A
    TYPE_B
    TYPE_C
  }

  type CustomInsertUserOutput {
    email: String!
    id: Int!
    name: String!
    email: Email!
    enum_value: SOME_ENUM
    nullable_field: Float
    nullable_list: [Int]
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

import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'
import { NEWLINE } from '../utils'

export const typescriptExpressTemplate = (params: CodegenTemplateParams) => {
  const { actionArgs, actionName, returnType, typeDefs, types, derive } = params

  const baseTemplate = template`
    import { Request, Response } from 'express'
    ${typeDefs}

    function ${actionName}Handler(args: ${actionName}Args): ${returnType} {

    }

    // Request Handler
    app.post('/${actionName}', async (req: Request, res: Response) => {
      // get request input
      const params: ${actionName}Args = req.body.input

      // run some business logic
      const result = ${actionName}Handler(params)

      /*
      // In case of errors:
      return res.status(400).json({
        message: "error happened"
      })
      */

      // success
      return res.json(result)
    })
  `

  // This is horrendous, but that chunk in the middle is the only way the GraphQL backtick-quoted multiline string will format properly
  const hasuraOperation = ' `' + derive?.operation + '`\n\n'

  const derivedTemplate =
    template`
    import { Request, Response } from 'express'
    import fetch from 'node-fetch'
    ${typeDefs}
    const HASURA_OPERATION =` +
    hasuraOperation +
    template`

    const execute = async (variables) => {
      const fetchResponse = await fetch('http://localhost:8080/v1/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: HASURA_OPERATION,
          variables,
        }),
      })
      const data = await fetchResponse.json()
      console.log('DEBUG: ', data)
      return data
    }

    // Request Handler
    app.post('/${actionName}', async (req: Request, res: Response) => {
      // get request input
      const params: ${actionName}Args = req.body.input
      // execute the parent operation in Hasura
      const { data, errors } = await execute(params)
      if (errors) return res.status(400).json(errors[0])
      // run some business logic

      // success
      return res.json(data)
    })
  `

  if (derive) return derivedTemplate
  else return baseTemplate
}

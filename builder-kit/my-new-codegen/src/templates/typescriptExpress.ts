import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'

export const typescriptExpressTemplate = (params: CodegenTemplateParams) => {
  const { actionArgs, actionName, returnType, typeDefs, types } = params
  return template`
    import { Request, Response } from 'express'
    ${typeDefs}

    function ${actionName}Handler(args: ${actionName}Args): ${returnType} {

    }

    // Request Handler
    const handler = async (req: Request, res: Response) => {
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
    }

    module.exports = handler
  `
}

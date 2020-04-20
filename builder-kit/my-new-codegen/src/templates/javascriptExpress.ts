import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'

// Use JSDoc Types for typeDefs args
export const javascriptExpressTemplate = (params: CodegenTemplateParams) => {
  const { actionArgs, actionName, returnType, typeDefs, types } = params
  return template`
    ${typeDefs}

    function ${actionName}Handler(args) {

    }

    // Request Handler
    const handler = async (req, res) => {
      // get request input
      const params = req.body.input

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

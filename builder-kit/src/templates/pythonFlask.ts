import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'
import { fieldFormatter } from '../languages-functional/python'

export const pythonFlaskTemplate = (params: CodegenTemplateParams) => {
  const { actionName, returnTypeField } = params
  const returnTypeObj = fieldFormatter(returnTypeField)

  let baseTemplate: string = template`
  from ${actionName}Types import ${actionName}Args, ${returnTypeObj.name}
  from flask import Flask, request, jsonify

  app = Flask(__name__)

  @app.route('/${actionName}', methods=['POST'])
  def ${actionName}Handler():
    args = ${actionName}Args.from_request(request.get_json())
    print(args)
    # business logic here

  if __name__ == '__main__':
    app.run(debug = True, host = '0.0.0.0')
  `

  return baseTemplate
}

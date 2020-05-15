import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'

export const pythonFlaskTemplate = (params: CodegenTemplateParams) => {
  const { actionName, returnType } = params

  let baseTemplate: string = template`
  from ${actionName}Types import ${actionName}Args, ${returnType}
  from flask import Flask, request, jsonify

  app = Flask(__name__)

  @app.route('/${actionName}', methods=['POST'])
  def ${actionName}Handler():
    args = ${actionName}Args.from_request(request.get_json())
    print(args)
    # business logic here
    return ${returnType}().to_json()

  if __name__ == '__main__':
    app.run(debug = True, host = '0.0.0.0')
  `

  return baseTemplate
}

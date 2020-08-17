import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'

export const pythonFlaskTemplate = (params: CodegenTemplateParams) => {
  const { actionName, returnType, typeMap } = params

  // Makes empty arguments for Python return type object, for user to fill in with proper values through business logic
  const returnTypeFields = typeMap.types[returnType]
  const returnTypePythonArgs = returnTypeFields
    .map((it) => it.getName() + '=')
    .join(', ')

  let baseTemplate: string = template`
  from ${actionName}Types import ${actionName}Args, ${returnType}
  from flask import Flask, request, jsonify

  app = Flask(__name__)

  @app.route('/${actionName}', methods=['POST'])
  def ${actionName}Handler():
    args = ${actionName}Args.from_request(request.get_json())
    print(args)
    # business logic here
    return ${returnType}(${returnTypePythonArgs}).to_json()

  if __name__ == '__main__':
    app.run(debug = True, host = '0.0.0.0')
  `

  return baseTemplate
}

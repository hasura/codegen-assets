import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'

export const pythonFlaskTemplate = (params: CodegenTemplateParams) => {
  const { actionName, returnType } = params

  let baseTemplate: string = template`
  from flask import Flask, request, jsonify

  app = Flask(__name__)

  @app.route('/sum', methods=['POST'])
  def ${actionName}Handler() -> ${returnType}:
    req_data = request.get_json()
    input: ${actionName}Args = req_data['input']
    print(input)
    # business logic here

  if __name__ == '__main__':
    app.run(debug = True, host = '0.0.0.0')
  `

  return baseTemplate
}

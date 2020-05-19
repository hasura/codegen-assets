import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'
import { fieldFormatter } from '../languages-functional/python'

export const pythonFastAPITemplate = (params: CodegenTemplateParams) => {
  const { actionName, returnTypeField } = params
  const returnTypeObj = fieldFormatter(returnTypeField)

  let baseTemplate: string = template`
    from fastapi import Body, FastAPI

    app = FastAPI()

    @app.post("/items/", response_model=${actionName}Args)
    async def ${actionName}Handler(item: ${actionName}Args = Body(...)) -> ${returnTypeObj.type}:
        # business logic here
  `
  // Need to replace "from dataclasses import dataclass" with "from "pydantic.dataclasses"
  // then add "(config=Config)" to all @dataclass objects
  // To get FastAPI to serialize the dataclass models properly
  // See https://github.com/tiangolo/fastapi/issues/624#issuecomment-569829199
  baseTemplate = baseTemplate
    .replace('from dataclasses', 'from pydantic.dataclasses')
    .replace(/@dataclass/gi, '@dataclass(config=Config)')

  return baseTemplate
}

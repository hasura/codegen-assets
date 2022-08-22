import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'

export const pythonFastAPITemplate = (params: CodegenTemplateParams) => {
  const { actionName, returnType } = params

  let baseTemplate: string = template`
    from fastapi import FastAPI
    from typing import Generic, TypeVar
    from pydantic import BaseModel
    from pydantic.generics import GenericModel
    from ${actionName}Types import ${actionName}Args, ${returnType}


    ActionInput = TypeVar("ActionInput", bound=BaseModel)


    class ActionName(BaseModel):
        name: str


    class ActionPayload(GenericModel, Generic[ActionInput]):
        action: ActionName
        input: ActionInput
        request_query: str
        session_variables: dict[str, str]


    app = FastAPI()


    @app.post("/${actionName}")
    async def ${actionName}Handler(action: ActionPayload[${actionName}Args]) -> ${returnType}:
        # business logic here
        return ${returnType}()
  `

  return baseTemplate
}

import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'
import { capitalize, kebabCase } from "../utils";

export const javaQuarkusTemplate = (params: CodegenTemplateParams) => {
  const { actionArgs, actionName, typeDefs, returnType } = params
  return template`
package my.package.action;

import javax.ws.rs.POST;
import javax.ws.rs.Path;

public class ActionsResource {
    @Path(/${kebabCase(actionName)})
    @POST
    public ${returnType} ${actionName}Handler(${capitalize(actionName)}Args actionArgs) {
        // logic
    }
}
`
}

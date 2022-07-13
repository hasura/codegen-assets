import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'
import {capitalize, kebabCase} from "../utils";

export const javaSpringBootTemplate = (params: CodegenTemplateParams) => {
  const { actionArgs, actionName, typeDefs, returnType } = params
  return template`
  package my_action;

  import java.util.List;

  import org.springframework.web.bind.annotation.PathVariable;
  import org.springframework.web.bind.annotation.PostMapping;
  import org.springframework.web.bind.annotation.RequestBody;
  import org.springframework.web.bind.annotation.RestController;

  @RestController
  class ActionController {
    @PostMapping("/${kebabCase(actionName)}")
    ${returnType} ${actionName}Handler(@RequestBody ${capitalize(actionName)}Args actionArgs) {
        // logic
    }
  }
    `
}

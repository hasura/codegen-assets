import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'

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
    @PostMapping("/${actionName}")
    ${returnType} handler(@RequestBody ${actionName}Args actionArgs) {
        // logic
    }
}
    `
}

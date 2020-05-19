import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'
import { fieldFormatter } from '../languages-functional/java'

export const javaSpringBootTemplate = (params: CodegenTemplateParams) => {
  const { actionName, returnTypeField } = params
  const returnTypeObj = fieldFormatter(returnTypeField)

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
    ${returnTypeObj.type} handler(@RequestBody ${actionName}Args actionArgs) {
        // logic
    }
}
    `
}

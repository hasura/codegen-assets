import { html as template } from 'common-tags'
import { ITypeNode, CodegenTemplateParams } from '../types'
import { getRootFieldName, capitalize } from '../utils';

const sampleValues = {
  'Int': 1111,
  'String': '"<sample value>"',
  'Boolean': false,
  'Float': 11.11,
  'ID': 1111
};

export const goServeMuxTemplate = (params: CodegenTemplateParams) => {
  const { actionArgs, actionName, returnType, typeDefs, typeMap, derive } = params
  
  const returnTypeDef = typeMap.types[returnType]

  let delegationTypedefs = derive ? template`

    type GraphQLRequest struct {
      Query     string               \`json:"query"\`
      Variables ${actionName}Args \`json:"variables"\`
    }
    type GraphQLData struct {
      ${getRootFieldName(derive.operation, true)} ${returnType} \`json:"${getRootFieldName(derive.operation)}"\`
    }
    type GraphQLResponse struct {
      Data   GraphQLData    \`json:"data,omitempty"\`
      Errors []GraphQLError \`json:"errors,omitempty"\`
    }
  ` : '';

  let executeFunc = derive ? template`
    func execute(variables ${actionName}Args) (response GraphQLResponse, err error) {

      // build the request body
      reqBody := GraphQLRequest{
        Query:     "${derive.operation}",
        Variables: variables,
      }
      reqBytes, err := json.Marshal(reqBody)
      if err != nil {
        return
      }

      // make request to Hasura
      resp, err := http.Post("http://localhost:8080/v1/graphql", "application/json", bytes.NewBuffer(reqBytes))
      if err != nil {
        return
      }

      // parse the response
      respBytes, err := ioutil.ReadAll(resp.Body)
      if err != nil {
        return
      }
      err = json.Unmarshal(respBytes, &response)
      if err != nil {
        return
      }

      // return the response
      return
    }

  ` : '';

  let handlerFunc = derive ? template`
    // Auto-generated function that takes the Action parameters and must return it's response type
    func ${actionName}(args ${actionName}Args) (response ${returnType}, err error) {

      hasuraResponse, err := execute(args)

      // throw if any unexpected error happens
      if err != nil {
        return
      }

      // delegate Hasura error
      if len(hasuraResponse.Errors) != 0 {
        err = errors.New(hasuraResponse.Errors[0].Message)
        return
      }

      response = hasuraResponse.Data.${getRootFieldName(derive.operation, true)}
      return

    }

  ` : template`
    // Auto-generated function that takes the Action parameters and must return it's response type
    func ${actionName}(args ${actionName}Args) (response ${returnType}, err error) {
      response =  ${returnType} {
        ${returnTypeDef.map(f => {
          return `${capitalize(f.getName())}: ${sampleValues[f.getName()]}`
        }).join(',\n')},
      }
      return response, nil
    }
  `

  return template`

    package main

    import (
      "bytes"
      "encoding/json"
      "io/ioutil"
      "log"
      "net/http"
    )

    ${typeDefs}

    type ActionPayload struct {
      SessionVariables map[string]interface{} \`json:"session_variables"\`
      Input            ${actionName}Args \`json:"input"\`
    }

    type GraphQLError struct {
      Message string \`json:"message"\`
    }

    ${delegationTypedefs}
    
    func handler(w http.ResponseWriter, r *http.Request) {

      // set the response header as JSON
      w.Header().Set("Content-Type", "application/json")

      // read request body
      reqBody, err := ioutil.ReadAll(r.Body)
      if err != nil {
        http.Error(w, "invalid payload", http.StatusBadRequest)
        return
      }

      // parse the body as action payload
      var actionPayload ActionPayload
      err = json.Unmarshal(reqBody, &actionPayload)
      if err != nil {
        http.Error(w, "invalid payload", http.StatusBadRequest)
        return
      }

      // Send the request params to the Action's generated handler function
      result, err := ${actionName}(actionPayload.Input)

      // throw if an error happens
      if err != nil {
        errorObject := GraphQLError{
          Message: err.Error(),
        }
        errorBody, _ := json.Marshal(errorObject)
        w.WriteHeader(http.StatusBadRequest)
        w.Write(errorBody)
        return
      }

      // Write the response as JSON
      data, _ := json.Marshal(result)
      w.Write(data)

    }

    ${handlerFunc}
    ${executeFunc}

    // HTTP server for the handler
    func main() {
      mux := http.NewServeMux()
      mux.HandleFunc("/${actionName}", handler)

      err := http.ListenAndServe(":3000", mux)
      log.Fatal(err)
    }
  `
}
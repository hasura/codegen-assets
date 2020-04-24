import { html as template } from 'common-tags'
import { ITypeNode, CodegenTemplateParams } from '../types'
import { getRootFieldName, NEWLINE } from '../utils'

const sampleValues = {
  Int: 1111,
  String: '"<sample value>"',
  Boolean: false,
  Float: 11.11,
  ID: 1111,
}

export const goServeMuxTemplate = (params: CodegenTemplateParams) => {
  const { actionName, returnType, typeDefs, derive, typeMap } = params

  const returnTypeDef = typeMap.types[returnType]

  let delegationTypedefs = derive?.operation
    ? template`
    
    type GraphQLRequest struct {
      query string
      variables ${actionName}Args
    }

    type GraphQLData struct {
      ${getRootFieldName(derive.operation)} ${actionName}Output
    }

    type GraphQLError struct {
      message string
    }

    type GraphQLResponse struct {
      data GraphQLData
      error []GraphQLError
    }
  `
    : ''

  let executeFunc = derive?.operation
    ? template`
    func execute (variables ${actionName}Args) (response ${returnType}, err Error) {
      reqBody := GraphQLRequest {
        query: "${derive.operation}",
        variables: variables,
      }
      reqBytes, err := json.Marshal(reqBody)
      if err != nil {
        return
      }
      respBytes, err := http.Post("${
        derive.endpoint
      }", "application/json", bytes.NewBuffer(reqBytes))
      if err != nil {
        return
      }
      hasuraResponse, err := json.Unmarshal(respBytes, GraphQLResponse)
      if err != nil {
        return
      }
      response := hasuraResponse.data.${getRootFieldName(derive.operation)}
      return;
    }
  `
    : ''

  const returnTypeValues = returnTypeDef
    .map((f) => `${f.getName()}: ${sampleValues[f.getTypename()]}`)
    .join(',' + NEWLINE)

  let handlerFunc = derive
    ? template`
    // Auto-generated function that takes the Action parameters and must return it's response type
    func ${actionName}(args ${actionName}Args) (response ${returnType}, err Error) {
      response, err := execute(args)
      return
    }   
  `
    : template`
    // Auto-generated function that takes the Action parameters and must return it's response type
    func ${actionName}(args ${actionName}Args) (${returnType}, Error) {
      response := ${returnType} {
        ${returnTypeValues}
      }
      return response, nil
    }
  `

  return template`

    package main

    import (
      "encoding/json"
      "log"
      "net/http"
    )      

    ${typeDefs}
    ${delegationTypedefs}
 
    func handler(w http.ResponseWriter, r *http.Request) {
      // Declare a new struct for unmarshalling the arguments
      var actionParams ${actionName}Args

      // Try to decode the request body into the struct. If there is an error,
      // respond to the client with the error message and a 400 status code.    
      err := json.NewDecoder(r.Body).Decode(&actionParams)
      if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
      }
      
      // Send the request params to the Action's generated handler function
      result, err := ${actionName}(actionParams)
      data, err := json.Marshal(result)
      if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
      }

      // Write the response as JSON
      w.WriteHeader(http.StatusOK)
      w.Header().Set("Content-Type", "application/json")
      w.Write(data)
    }

    ${handlerFunc}
    ${executeFunc}

    // HTTP server for the handler
    func main() {
      mux := http.NewServeMux()
      mux.HandleFunc("/${actionName}", handler)

      err := http.ListenAndServe(":8080", mux)
      log.Fatal(err)
    }
  `
}

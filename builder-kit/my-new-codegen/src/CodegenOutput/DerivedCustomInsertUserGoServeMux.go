package main

import (
  "bytes"
  "encoding/json"
  "io/ioutil"
  "log"
  "net/http"
)

type Mutation struct {
    CustomInsertUser *CustomInsertUserOutput
}

type CustomInsertUserOutput struct {
    email string
    id int
    name string
    enum_value *SOME_ENUM
    nullable_field *float32
    nullable_list []*int
}

type CustomInsertUserArgs struct {
    email string
    name string
}

type SOME_ENUM string

const(
    TYPE_A SOME_ENUM = "TYPE_A"
    TYPE_B = "TYPE_B"
    TYPE_C = "TYPE_C"
)

type ActionPayload struct {
  SessionVariables map[string]interface{} `json:"session_variables"`
  Input            CustomInsertUserArgs `json:"input"`
}

type GraphQLError struct {
  Message string `json:"message"`
}

type GraphQLRequest struct {
  Query     string               `json:"query"`
  Variables CustomInsertUserArgs `json:"variables"`
}
type GraphQLData struct {
  Insert_user_one CustomInsertUserOutput `json:"insert_user_one"`
}
type GraphQLResponse struct {
  Data   GraphQLData    `json:"data,omitempty"`
  Errors []GraphQLError `json:"errors,omitempty"`
}

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
  result, err := CustomInsertUser(actionPayload.Input)

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

// Auto-generated function that takes the Action parameters and must return it's response type
func CustomInsertUser(args CustomInsertUserArgs) (response CustomInsertUserOutput, err error) {

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

  response = hasuraResponse.Data.Insert_user_one
  return

}
func execute(variables CustomInsertUserArgs) (response GraphQLResponse, err error) {

  // build the request body
  reqBody := GraphQLRequest{
    Query:     "mutation CustomInsertUser($email: String!, $name: String!) {   insert_user_one(object: {email: $email, name: $name}) {       id       name       email   } }",
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

// HTTP server for the handler
func main() {
  mux := http.NewServeMux()
  mux.HandleFunc("/CustomInsertUser", handler)

  err := http.ListenAndServe(":3000", mux)
  log.Fatal(err)
}
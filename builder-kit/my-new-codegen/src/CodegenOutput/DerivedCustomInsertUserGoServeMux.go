package main

import (
  "encoding/json"
  "log"
  "net/http"
)      

type Mutation struct{
  CustomInsertUser *CustomInsertUserOutput
}

type CustomInsertUserOutput struct{
  email string
  id int
  name string
  enum_value *SOME_ENUM
  nullable_field *float32
  nullable_list *[]int
}

type CustomInsertUserArgs struct{
  email string
  name string
}

type SOME_ENUM string 

const(
  SOME_ENUM   TYPE_A = "TYPE_A"
  TYPE_B = "TYPE_B"
  TYPE_C = "TYPE_C"
)

type GraphQLRequest struct {
  query string
  variables CustomInsertUserArgs
}

type GraphQLData struct {
  insert_user_one CustomInsertUserOutput
}

type GraphQLError struct {
  message string
}

type GraphQLResponse struct {
  data GraphQLData
  error []GraphQLError
}
 
func handler(w http.ResponseWriter, r *http.Request) {
  // Declare a new struct for unmarshalling the arguments
  var actionParams CustomInsertUserArgs

  // Try to decode the request body into the struct. If there is an error,
  // respond to the client with the error message and a 400 status code.    
  err := json.NewDecoder(r.Body).Decode(&actionParams)
  if err != nil {
    http.Error(w, err.Error(), http.StatusBadRequest)
    return
  }
  
  // Send the request params to the Action's generated handler function
  result, err := CustomInsertUser(actionParams)
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

// Auto-generated function that takes the Action parameters and must return it's response type
func CustomInsertUser(args CustomInsertUserArgs) (response CustomInsertUserOutput, err Error) {
  response, err := execute(args)
  return
}
func execute (variables CustomInsertUserArgs) (response CustomInsertUserOutput, err Error) {
  reqBody := GraphQLRequest {
    query: "mutation CustomInsertUser($email: String!, $name: String!) {   insert_user_one(object: {email: $email, name: $name}) {       id       name       email   } }",
    variables: variables,
  }
  reqBytes, err := json.Marshal(reqBody)
  if err != nil {
    return
  }
  respBytes, err := http.Post("http://localhost:8080/v1/graphql", "application/json", bytes.NewBuffer(reqBytes))
  if err != nil {
    return
  }
  hasuraResponse, err := json.Unmarshal(respBytes, GraphQLResponse)
  if err != nil {
    return
  }
  response := hasuraResponse.data.insert_user_one
  return;
}

// HTTP server for the handler
func main() {
  mux := http.NewServeMux()
  mux.HandleFunc("/CustomInsertUser", handler)

  err := http.ListenAndServe(":8080", mux)
  log.Fatal(err)
}
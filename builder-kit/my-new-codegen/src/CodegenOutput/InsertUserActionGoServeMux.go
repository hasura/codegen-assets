package main

import (
  "bytes"
  "encoding/json"
  "io/ioutil"
  "log"
  "net/http"
)

type Mutation struct {
    InsertUserAction *TokenOutput
}

type UserInfo struct {
    username string
    password string
    enum_field SOME_ENUM
    nullable_field *float32
    nullable_list []*int
}

type TokenOutput struct {
    accessToken string
}

type InsertUserActionArgs struct {
    user_info UserInfo
}

type SOME_ENUM string

const(
    TYPE_A SOME_ENUM = "TYPE_A"
    TYPE_B = "TYPE_B"
    TYPE_C = "TYPE_C"
)

type ActionPayload struct {
  SessionVariables map[string]interface{} `json:"session_variables"`
  Input            InsertUserActionArgs `json:"input"`
}

type GraphQLError struct {
  Message string `json:"message"`
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
  result, err := InsertUserAction(actionPayload.Input)

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
func InsertUserAction(args InsertUserActionArgs) (response TokenOutput, err error) {
  response =  TokenOutput {
    AccessToken: undefined,
  }
  return response, nil
}


// HTTP server for the handler
func main() {
  mux := http.NewServeMux()
  mux.HandleFunc("/InsertUserAction", handler)

  err := http.ListenAndServe(":3000", mux)
  log.Fatal(err)
}
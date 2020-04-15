# Contribution guidelines for codegen

## The `templater` function

Each codegenerator is a function (`templater`) that accepts the following parameters:
- `actionName`: Name of the action to codegen for
- `actionsSdl`: All the actions and the custom types in GraphQL SDL format
- `derive`: (optional) If the action has been derived from a Hasura query/operation, this payload is of the following structure:
    
    ```json
    {
      "operation": "mutation { insert_user { id } }",
      "endpoint": "https://my-app.herokuapp.com/v1/graphql"
    }
    ```

This function must return a list of files, each file being:

```json
{
  "name": "<filename>",
  "content": "<file content>"
}
```

**On the CLI**, each element of this list will be spit out as a new file.
**On the console**, each element of this list will be put under different tabs under the `Codegen` tab on the actions page.

While you build a codegen, it's recommended that you follow these phases:

## Phase 1: Handler codegen

Every action needs a basic action handler, an HTTP handler. This action handler must do the following:

1. Parse the actions SDL and find the action definition
2. Extract the input arguments of the action into variables of appropriate types
3. Add some space and comments for telling the user to run business logic
4. Extract the returning type of the action and return a response of the returning type with dummy variables

For typed languages, it might be a good idea to have type definitions of arguments and returning types in a separate file, however this might depend highly on the language semantics.

An example handler for NodeJS:

```js
// Request Handler
app.post('/login', async (req, res) => {

  // get input arguments
  const { username, pasword } = req.body.input;

  // run some business logic


  // success
  return res.json({
    id: "<dummy id>",
  })

});
```

## Phase 2: Delegation logic for derived actions

The idea behind [derived actions](https://hasura.io/docs/1.0/graphql/manual/actions/derive.html) is to perform some business logic (data validation, transformation, enrichment etc) before committing the mutation to Hasura. Due to GraphQL's strong type system, we can also autogenerate the boilerplate code for delegation:

The steps of development would look like:

1. Write an `execute` function outside the handler that runs the underlying Hasura mutation
2. Call this `execute` function from the handler with the input arguments as variables.
3. If the Hasura mutation errors out, return an error to the user, else, just forward the response

An example handler with delegation logic for NodeJS:

```js
const fetch = require("node-fetch")

const HASURA_OPERATION = `
mutation ($username: String!, $password: String!){
  insert_user_one (object: {
    username: $username
    password: $password
  }) {
    id
  }
}
`;

// execute the parent operation in Hasura
const execute = async (variables) => {
  const fetchResponse = await fetch(
    "http://localhost:8080/v1/graphql",
    {
      method: 'POST',
      body: JSON.stringify({
        query: HASURA_OPERATION,
        variables
      })
    }
  );
  const data = await fetchResponse.json();
  console.log('DEBUG: ', data);
  return data;
};
  

// Request Handler
app.post('/InsertUserOneDerived', async (req, res) => {

  // get request arguments
  const { username, password } = req.body.input;

  // run some business logic

  // execute the Hasura operation
  const { data, errors } = await execute({ username, password });

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0])
  }

  // success
  return res.json({
    ...data.insert_user_one
  })

});
```

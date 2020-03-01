/* Files to be generated: handler and types (optional)

- Take input from request JSON body
- Extract Hasura payload into an object.
  {
    session_variables: {
      'x-hasura-user-id': <>,
      'x-hasura-role': <>,
      'x-hasura-xxxx': <>
    },
    input: {
      arg1: <>,
      arg2: <>
    }
  }
  - If this is a typed language:
  - codegen the types in the second file &
  - parse into the right type if this is a typed language
- If this is derived from a hasura mutation
  - Take the inputs and use them to create variables
  - Pass these variables and fire the underlying Hasura mutation
  - If Hasura mutation returns error, return error
  - Else return the exact response that the Hasura mutation returns
- If this is not derived:
  - Have a small error block showing what an error response would look like
  - Return a success with a JSON object, the keys set to the return type
    of the action
*/

// Let us now begin the codegen!
const { parse } = require('graphql');

// actionName: Name of the action
// actionsSdl: GraphQL SDL string that has the action and dependent types
// derive: Whether this action was asked to be derived from a Hasura mutation
//         derive.mutation contains the mutation string
const templater = (actionName, actionsSdl, derive) => {

  console.log('Running the codegen for: ' + actionName);

  // Parse the actions SDL into an AST
  let ast;
  ast = parse(actionsSdl);

  // Find the Mutation type for this action
  const actionMutationTypeDef = ast.definitions
    .find(def => (def.name.value === 'Mutation'))
    .fields
    .find(def => (def.name.value === actionName));

  // If the input arguments are {name, age, email}
  // then we want to generate: const {name, age, email} = req.body
  const inputArgumentsNames = actionMutationTypeDef.arguments.map(i => i.name.value);
  console.log('Input arguments: ' + inputArgumentsNames);

  // If the output type is type ActionResult {field1: <>, field2: <>}
  // we want to template the response of the handler to be:
  // {
  //    field1: "",
  //    field2: ""
  // }
  const actionOutputType = ast.definitions
    .find(def => (def.name.value === actionMutationTypeDef.type.name.value))
  console.log('Output type: ' + actionOutputType.name.value);
  const outputTypeFieldNames = actionOutputType.fields.map(f => f.name.value);
  console.log('Output type fields: ' + outputTypeFieldNames);

  // Generate the basic handler code
  let basicHandlerCode;

  // If this action is being derived for an existing mutation
  // then we'll add a fetch API call
  let deriveCode;
  if (derive) {
    const mutationAST = parse(derive.mutation);
    const queryRootField = mutationAST.definitions[0].selectionSet
      .selections
      .find(f => (!f.name.value.startsWith('__')))
    const queryRootFieldName = queryRootField.alias ?
      queryRootField.alias.value :
      queryRootField.name.value;
    const variableNames = mutationAST.definitions[0]
      .variableDefinitions
      .map(vdef => vdef.variable.name.value);

    console.log('Derive:: \n' + derive.mutation);
    console.log('Derive:: root field name: ' + queryRootFieldName);
    console.log('Derive:: variable names: ' + variableNames);

    // Generate the code for the derived hasura query
    // this code has some fetch logic and some logic to run the fetch
  }

  // Render the handler!
  let finalHandlerCode = ''
  if (!derive) {
    finalHandlerCode += basicHandlerCode;
  } else {
    finalHandlerCode += deriveCode + basicHandlerCode;
  }

  return [
    {
      name: actionName + 'Handler.md',
      content: finalHandlerCode
    }
  ];
};

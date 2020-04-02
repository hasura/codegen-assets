const templater = (actionName, actionsSdl, derive) => {

  const ast = parse(`${actionsSdl}`);

  let mutationDef;

  const mutationAst = {
    ...ast,
    definitions: ast.definitions.filter(d => {
      if (d.name.value === 'Mutation' && (d.kind === 'ObjectTypeDefinition' || d.kind === 'ObjectTypeExtension')) {
        if (mutationDef) return false
        mutationDef = d.fields.find(f => f.name.value === actionName);
        if (!mutationDef) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    })
  }

  const mutationName = mutationDef.name.value;
  const mutationArguments = mutationDef.arguments;
  let mutationOutputType = mutationDef.type;

  while (mutationOutputType.kind !== 'NamedType') {
    mutationOutputType = mutationOutputType.type;
  }
  const outputType = ast.definitions.find(d => {
    return (d.kind === 'ObjectTypeDefinition' && d.name.value === mutationOutputType.name.value)
  });

  const outputTypeFields = outputType.fields.map(f => f.name.value);

  let graphqlClientCode = '';
  let operationCodegen = '';
  let validateFunction = '';
  let errorSnippet = '';
  let successSnippet = '';
  let executeFunction = '';

  const requestInputDestructured = `{ ${mutationDef.arguments.map(a => a.name.value).join(', ')} }`;

  const shouldDerive = !!(derive && derive.operation);
  const hasuraEndpoint = derive && derive.endpoint ? derive.endpoint : 'http://localhost:8080/v1/graphql';
  if (shouldDerive) {

    const operationDoc = parse(derive.operation);
    const operationName = operationDoc.definitions[0].selectionSet.selections.filter(s => s.name.value.indexOf('__') !== 0)[0].name.value;

    operationCodegen = `
const HASURA_OPERATION = \`
${derive.operation}
\`;`;

    executeFunction = `
// execute the parent mutation in Hasura
const execute = async (variables) => {
  const fetchResponse = await fetch(
    "${hasuraEndpoint}",
    {
      method: 'POST',
      body: JSON.stringify({
        query: HASURA_OPERATION,
        variables
      })
    }
  );
  return await fetchResponse.json();
};
  `

    graphqlClientCode = `
  // execute the Hasura operation
  const { data, errors } = await execute(${requestInputDestructured});`

    errorSnippet = `  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json({
      message: errors.message
    })
  }`;

    successSnippet = `  // success
  return res.json({
    ...data.${operationName}
  })`

  }

  if (!errorSnippet) {
    errorSnippet = `  /*
  // In case of errors:
  return res.status(400).json({
    message: "error happened"
  })
  */`
  }

  if (!successSnippet) {
    successSnippet = `  // success
  return res.json({
${outputTypeFields.map(f => `    ${f}: "<value>"`).join(',\n')}
  })`;
  }

  const handlerContent = `
${shouldDerive ? 'const fetch = require("node-fetch")\n' : ''}${shouldDerive ? `${operationCodegen}\n` : ''}${shouldDerive ? `${executeFunction}\n` : ''}
// Request Handler
const handler = async (req, res) => {

  // get request input
  const ${requestInputDestructured} = req.body.input;

  // run some business logic
${shouldDerive ? graphqlClientCode : ''}

${errorSnippet}

${successSnippet}

}

module.exports = handler;
`;

  const handlerFile = {
    name: `${mutationName}.js`,
    content: handlerContent
  }

  return [handlerFile];

}

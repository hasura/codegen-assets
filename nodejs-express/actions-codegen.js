const templater = (actionName, actionsSdl, derive) => {

  const ast = parse(`${actionsSdl}`);

  let mutationDef;
  const mutationAst = {
    ...ast,
    definitions: ast.definitions.filter(d => {
      if (d.name.value === 'Mutation') {
        if (mutationDef) return false
        mutationDef = d.fields.find(f => f.name.value === actionName);
        if (!mutationDef) {
          return false;
        } {
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
  let mutationCodegen = '';
  let validateFunction = '';
  let errorSnippet = '';
  let successSnippet = '';
  let executeFunction = '';

  const requestInputDestructured = `{ ${mutationDef.arguments.map(a => a.name.value).join(', ')} }`;

  if (derive && derive.mutation) {

    const operationDoc = parse(derive.mutation);
    const operationName = operationDoc.definitions[0].selectionSet.selections.filter(s => s.name.value.indexOf('__') !== 0)[0].name.value;

    mutationCodegen = `
const HASURA_MUTATION = \`${derive.mutation}\`;`;

    executeFunction = `
// execute the parent mutation in Hasura
const execute = async (variables) => {
  const fetchResponse = await fetch(
    'https://community-call-demo.herokuapp.com/v1/graphql',
    {
      method: 'POST',
      body: JSON.stringify({
        query: HASURA_MUTATION,
        variables
      })
    }
  );
  return await fetchResponse.json();
};
  `


    graphqlClientCode = `
  // execute the Hasura mutation
  const { data, errors } = await execute(${requestInputDestructured});`

    errorSnippet = `  // if Hasura mutation errors, then throw error
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
${derive ? 'const fetch = require("node-fetch")\n' : ''}${derive ? `${mutationCodegen}\n` : ''}${derive ? `${executeFunction}\n` : ''}
// Request Handler
const handler = async (req, res) => {

  // get request input
  const ${requestInputDestructured} = req.body.input;

  // run some business logic
${derive ? graphqlClientCode : ''}

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

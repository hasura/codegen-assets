/*Utils*/

const getWrappingTypeMetadata = (_type) => {
  let type = JSON.parse(JSON.stringify(_type));
  const wrapperStack = [];
  while (type.kind !== 'NamedType') {
    if (type.kind === 'ListType') {
      wrapperStack.push('l');
    }
    if(type.kind === 'NonNullType') {
      wrapperStack.push('n');
    }
    type = type.type;
  }
  const typename = type.name.value;
  return {
    typename,
    stack: wrapperStack.reverse()
  }
}

const getTypescriptTypename = (_typename, wrapperStack) => {
  let typename = _typename;
  if (!wrapperStack.length || wrapperStack[0] === 'l') {
    typename = `Maybe<${typename}>`
  }
  wrapperStack.forEach((w, i) => {
    if (w === 'l') {
      if (wrapperStack[i+1] === 'n') {
        typename = `Array <${typename}>`
      } else {
        typename = `Maybe <Array<${typename}>>`
      }
    }
  });
  return typename;
}

const templater = async (actionName, actionsSdl, derive) => {

  const ast = parse(`${actionsSdl}`);

  const typesAst = {
    ...ast,
    definitions: ast.definitions.filter(d => d.name.value !== 'Mutation')
  };

  const allMutationDefs = ast.definitions.filter(d => d.name.value === 'Mutation');
  let allMutationFields = [];
  allMutationDefs.forEach(md => {
    allMutationFields = [...allMutationFields, ...md.fields]
  });

  const mutationRootDef = ast.definitions.find(d => d.name.value === 'Mutation');
  mutationRootDef.kind = 'ObjectTypeDefinition';
  mutationRootDef.fields = allMutationFields;
  typesAst.definitions.push(mutationRootDef);

  const codegenConfig = {
    schema: typesAst,
    plugins: [
      {
        typescript: {},
      },
    ],
    pluginMap: {
      typescript: typescriptPlugin
    }
  }
  const typesCodegen = await codegen(codegenConfig);
  const typesFileMetadata = {
    content: typesCodegen,
    name: `hasuraCustomTypes.ts`
  }

  let mutationDef;
  const mutationAst = {
    ...ast,
    definitions: ast.definitions.filter(d => {
      if (d.name.value === 'Mutation') {
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

  const mutationArgType = (`Mutation${camelize(actionName)}Args`)

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

  const shouldDerive = !!(derive && derive.operation)
  const hasuraEndpoint = derive && derive.endpoint ? derive.endpoint : 'http://localhost:8080/v1/graphql';
  if (shouldDerive) {

    const operationDoc = parse(derive.operation);
    const operationName = operationDoc.definitions[0].selectionSet.selections.filter(s => s.name.value.indexOf('__') !== 0)[0].name.value;

    operationCodegen = `
const HASURA_OPERATION = \`${derive.operation}\`;`;

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
  const data = await fetchResponse.json();
  console.log('DEBUG: ', data);
  return data;
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

  const handlerContent = `import { NowRequest, NowResponse } from '@now/node';
import { ${mutationArgType} } from './hasuraCustomTypes';
${derive ? 'import fetch from "node-fetch"\n' : ''}${derive ? `${operationCodegen}\n` : ''}${derive ? `${executeFunction}\n` : ''}
// Request Handler
const handler = async (req: NowRequest, res: NowResponse) => {

  // get request input
  const ${requestInputDestructured}: ${mutationArgType} = req.body.input;

  // run some business logic
${derive ? graphqlClientCode : ''}

${errorSnippet}

${successSnippet}

}

export default handler;
`;

  const handlerFileMetadata = {
    name: `${mutationName}.ts`,
    content: handlerContent
  }

  return [handlerFileMetadata, typesFileMetadata];

}

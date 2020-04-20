import { buildClientSchema, printSchema } from 'graphql'
import { documentApi } from 'graphql-extra'
/**
 * Notes on possibilites for "Derive" and future work with codegen:
 *
 * It is possible to take the introspection schema from Derive, and codegen
 * all of Hasura's types with it. We can do it like this:
 *
 * Call buildClientSchema() on derive.introspection_schema to create a GraphQL Schema object
 */
const schema = buildClientSchema(derive.introspection_schema)
/**
 *
 * We need this function to skirt graphql-extra not parsing the root fields of a schema
 */
const removeSchemaRoot = (schemaString: string) =>
  schemaString.replace(
    `schema {
  query: query_root
  mutation: mutation_root
  subscription: subscription_root
}`,
    ''
  )
/**
 * Now use printSchema() to convert the JSON AST format to a string schema
 * and cut the root definitions off of it so that we can pass it to graphql-extra
 */
const schemaString = printSchema(schema)
const schemaWithoutRoot = removeSchemaRoot(schemaString)
/**
 * Pass the root-less schema string SDL to documentApi() from graphql-extra
 * Now we have a powerful API object for interacting with the schema
 * and can re-use our codegen functions because we have the proper API
 */
const document = documentApi().addSDL(schemaWithoutRoot)
/**
 * Convert ALL OF HASURA'S SCHEMA to language types:
 */
const typescriptConverter = new TSTypeConverter({
  schema: document.toSDLString(),
  isAction: false,
})
const pythonConverter = new PythonTypeConverter({
  schema: document.toSDLString(),
  isAction: false,
})
console.log(typescriptConverter.generateTypes())
console.log(typescriptConverter.generateTypes())
/**
 * We can grab the Action's root field
 */
const getActionRoot = (actionType: ActionType) => {
  switch (actionType) {
    case 'Mutation':
      return 'mutation_root'
    case 'Query':
      return 'query_root'
  }
}
const actionType = getActionType(documentApi().addSDL(actionSdl))
const actionRoot = document.getObjectType(getActionRoot(actionType))
/**
 * Now we can peek into the root of Mutation/Query for the Derived field
 */
const userInsert = actionRoot.getField('insert_user')
console.log(serializeField(userInsert))
/**
 * Or all the fields
 */
const actionRootFields = mapSerializeFields(actionRoot)

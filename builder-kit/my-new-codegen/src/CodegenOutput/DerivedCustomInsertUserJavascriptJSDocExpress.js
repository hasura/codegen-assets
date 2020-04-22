import fetch from 'node-fetch'
/** 
  * @typedef {Object} Mutation
  *  @property {CustomInsertUserOutput} [CustomInsertUser]
 **/
/** 
  * @typedef {Object} CustomInsertUserOutput
  *  @property {string} email
  *  @property {number} id
  *  @property {string} name
  *  @property {SOME_ENUM} [enum_value]
  *  @property {number} [nullable_field]
  *  @property {Array<number>} [nullable_list]
 **/
/** 
  * @typedef {Object} CustomInsertUserArgs
  *  @property {string} email
  *  @property {string} name
 **/
/** 
  * @enum {String} SOME_ENUM
  *  @property {TYPE_A}
  *  @property {TYPE_B}
  *  @property {TYPE_C}
 **/

const HASURA_OPERATION = `mutation CustomInsertUser($email: String!, $name: String!) {
  insert_user_one(object: {email: $email, name: $name}) {
      id
      name
      email
  }
}`

const execute = async (variables) => {
  const fetchResponse = await fetch('http://localhost:8080/v1/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: HASURA_OPERATION,
      variables,
    }),
  })
  const data = await fetchResponse.json()
  console.log('DEBUG: ', data)
  return data
}

// Request Handler
app.post('/CustomInsertUser', async (req, res) => {
  // get request input
  const params = req.body.input
  // execute the parent operation in Hasura
  const { data, errors } = await execute(params)
  if (errors) return res.status(400).json(errors[0])
  // run some business logic

  // success
  return res.json(data)
})
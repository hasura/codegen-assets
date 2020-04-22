import { Request, Response } from 'express'
import fetch from 'node-fetch'

type Maybe<T> = T | null
 
type Mutation = {
  CustomInsertUser?: Maybe<CustomInsertUserOutput>
}

type CustomInsertUserOutput = {
  email: string
  id: number
  name: string
  enum_value?: Maybe<SOME_ENUM>
  nullable_field?: Maybe<number>
  nullable_list?: Maybe<Array<Maybe<number>>>
}

type CustomInsertUserArgs = {
  email: string
  name: string
}

enum SOME_ENUM {
  TYPE_A = 'TYPE_A',
  TYPE_B = 'TYPE_B',
  TYPE_C = 'TYPE_C'
}


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
app.post('/CustomInsertUser', async (req: Request, res: Response) => {
  // get request input
  const params: CustomInsertUserArgs = req.body.input
  // execute the parent operation in Hasura
  const { data, errors } = await execute(params)
  if (errors) return res.status(400).json(errors[0])
  // run some business logic

  // success
  return res.json(data)
})
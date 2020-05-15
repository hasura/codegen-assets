import { Request, Response } from 'express'
type Maybe<T> = T | null

type Mutation = {
  InsertUserAction?: Maybe<TokenOutput>
}

type UserInfo = {
  username: string
  password: string
  enum_field: SOME_ENUM
  nullable_field?: Maybe<number>
  nullable_list?: Maybe<Array<Maybe<number>>>
}

type TokenOutput = {
  accessToken: string
}

type InsertUserActionArgs = {
  user_info: UserInfo
}

enum SOME_ENUM {
  TYPE_A = 'TYPE_A',
  TYPE_B = 'TYPE_B',
  TYPE_C = 'TYPE_C'
}

function InsertUserActionHandler(args: InsertUserActionArgs): TokenOutput {

}

// Request Handler
app.post('/InsertUserAction', async (req: Request, res: Response) => {
  // get request input
  const params: InsertUserActionArgs = req.body.input

  // run some business logic
  const result = InsertUserActionHandler(params)

  /*
  // In case of errors:
  return res.status(400).json({
    message: "error happened"
  })
  */

  // success
  return res.json(result)
})
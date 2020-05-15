import { DeriveParams } from './types'

/**
 * A sample Derive payload for a database with a table of User (id: int, name: string, email: string)
 *
 *  type Mutation {
 *     # Derived mutation
 *     CustomInsertUser(email: String!, name: String!): CustomInsertUserOutput
 *   }
 *
 *   type Mutation {
 *     InsertUserAction(user_info: UserInfo!): TokenOutput
 *   }
 *
 *   input UserInfo {
 *     username: String!
 *     password: String!
 *   }
 *
 *   type TokenOutput {
 *     accessToken: String!
 *   }
 *
 *   type CustomInsertUserOutput {
 *     email: String!
 *     id: Int!
 *     name: String!
 *   }
 *
 */
export const customInsertUserDerive: DeriveParams = {
  endpoint: "http://localhost:8080/v1/graphql",
  operation:
    'mutation CustomInsertUser($email: String!, $name: String!) {\n  insert_user_one(object: {email: $email, name: $name}) {\n      id\n      name\n      email\n  }\n}',
};

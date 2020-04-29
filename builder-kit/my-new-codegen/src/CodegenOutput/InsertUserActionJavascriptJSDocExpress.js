/** 
  * @typedef {Object} Mutation
  * @property {[TokenOutput]} InsertUserAction
  */

/** 
  * @typedef {Object} UserInfo
  * @property {string} username
  * @property {string} password
  * @property {SOME_ENUM} enum_field
  * @property {[number]} nullable_field
  * @property {Array<[number]>} nullable_list
  */

/** 
  * @typedef {Object} TokenOutput
  * @property {string} accessToken
  */

/** 
  * @typedef {Object} InsertUserActionArgs
  * @property {UserInfo} user_info
  */

/** 
 * @enum {Object} SOME_ENUM
 * @property {string} TYPE_A
 * @property {string} TYPE_B
 * @property {string} TYPE_C
 */

function InsertUserActionHandler(args) {

}

// Request Handler
app.post('/InsertUserAction', async (req, res) => {
  // get request input
  const params = req.body.input

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
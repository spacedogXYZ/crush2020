const { FAUNA_SERVER_SECRET } = process.env
var faunadb = require('faunadb')
var q = faunadb.query

var client = new faunadb.Client({ secret: FAUNA_SERVER_SECRET })

exports.handler = async (event) => {
  const { queryStringParameters: { uid }} = event
  return client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index("getForm"), uid)
      ),
      q.Lambda(
        "id",
        q.Get(q.Var("id"))
      )
    )
  )
  .then((response) => {
    let match = response.data[0]
    if (match) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          id: match.ref.id,
          data: match.data
        })
      }
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "not found"
        })
      }
    }
  })
  .catch((err) => {
    console.error(err)
    return {
    statusCode: err.requestResult.statusCode || 500,
    body: JSON.stringify({
      message: err.description,
    })
  }})
}

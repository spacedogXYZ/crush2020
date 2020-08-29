const { FAUNA_SERVER_SECRET } = process.env
var faunadb = require('faunadb'),
  q = faunadb.query

var client = new faunadb.Client({ secret: FAUNA_SERVER_SECRET })

exports.handler = async (event) => {
  const { queryStringParameters: { uid }} = event
  return client.query(
    q.Get(q.Ref(q.Collection('Form'), id))
  )
  .then((response) => ({
    statusCode: 200,
    body: JSON.stringify({
      id: response.ref.id,
      data: response.data
    })
  }))
  .catch((err) => ({
    statusCode: err.requestResult.statusCode || 500,
    body: JSON.stringify({
      description: err.description,
    })
  }))
}

const { ACTION_NETWORK_URL } = process.env
const axios = require("axios")

var splitName = (name) => {
  // tries to naively split first/last from single name

  let parts = name.split(" ")
  let first = parts.slice(0, 1).join(" ")
  let last = parts.slice(1, parts.length).join(" ")
  return [first, last]
}

exports.handler = async (event) => {
  const { body } = event
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "post to this endpoint"
      })
    }
  }
  var data
  try {
    data = JSON.parse(body)
  } catch (err) {
    console.error(err)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "invalid json"
      })
    }
  }

  const requiredFields = ["name", "contact", "geocode"]

  for (i in requiredFields) {
    let f = requiredFields[i]
    if (!data[f]) {
      console.error(`${f} required`)
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `${f} is required`
        })
      }
    }
  }

  // ok, we have a valid submission

  // send to action network
  let signup = {
    person: {
      family_name: splitName(data.name)[1],
      given_name: splitName(data.name)[0],
      postal_addresses: [
        {
          address_lines: [data.geocode.line1],
          locality: data.geocode.city,
          region: data.geocode.state,
          postal_code: data.geocode.zip,
          country: "US",
        },
      ],
      email_addresses: [
        {
          address: data.contact.email,
          status: "subscribed",
        },
      ],
      custom_fields: {
        uid: data.uid,
        twitter: data.contact.twitter,
        instagram: data.contact.instagram,
        time: data.time,
        money: data.money,
      },
    },
    add_tags: data.issues,
    triggers: {
      autoresponse: {
        enabled: true,
      },
    },
  }
  if (data.registered === "no" || data.registered === "not-sure") {
    signup.add_tags.push('NEEDS_TO_REGISTER')
  }
  if (data.vbm === "yes" || data.vbm === "not-sure") {
    signup.add_tags.push('VBM_INTERESTED')
  }
  return axios.post(ACTION_NETWORK_URL, signup)
    .then((res) => (
      // blind ActionNetwork posts don't return any data
      // assume successful if there's no error state
      {
        statusCode: 200,
        body: JSON.stringify({
          message: "ok"
        }),
      })
    ).catch((err) => (
      {
        statusCode: 500,
        body: JSON.stringify(err.message),
      }
    ))
  return result
}

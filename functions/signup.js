const fetch = require('node-fetch')
const { ACTION_NETWORK_URL } = process.env

function splitName(name) {
  // tries to naively split first/last from single name

  let parts = name.split(' ')
  let first = parts.slice(0, 1).join(' ')
  let last = parts.slice(1, parts.length).join(' ')
  return [first, last]
}

exports.handler = async function(event) {
  if (!event.body) {
    return {
        statusCode: 400,
        body: `post to this endpoint`
    }
  }
  var data
  try {
    data = JSON.parse(event.body);
  }
  catch(err) {
    console.error(err)
    return { statusCode: 400, body: 'invalid json'}
  }

  const requiredFields = [
   "name", "email", "geocode",
  ];

  for (i in requiredFields) {
    let f = requiredFields[i]
    if (!data[f]) {
      console.error(`${f} required`)
      return {
          statusCode: 400,
          body: `${f} is required`
      }
    }
  }

  // ok, we have a valid submission

  // send to action network
  let signup = {
    "person" : {
      "family_name" : splitName(data.contact.name)[1],
      "given_name" : splitName(data.contact.name)[0],
      "postal_addresses" : [ 
        {
          "address_lines" : [
            data.geocode.line1
          ],
          "locality" : data.geocode.city,
          "region" : data.geocode.state,
          "postal_code" : data.geocode.zip,
          "country" : "US" 
        }
      ],
      "email_addresses" : [ 
        { 
          "address" : data.contact.email,
          "status" : "subscribed"
        }
      ]
    },
    "triggers": {
      "autoresponse": {
        "enabled": true
      }
    }
  }
  const response = await fetch(ACTION_NETWORK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signup),
  })
  if(response.ok) {
    return {
      statusCode: 200,
      body: "Success!",
    }
  } else {
    return {
      statusCode: 500,
      body: response.text()
    }
  }
}
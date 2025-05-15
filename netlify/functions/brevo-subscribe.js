const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { email } = JSON.parse(event.body);
    
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email,
        listIds: [3],
        updateEnabled: true
      })
    });

    if (!response.ok) throw new Error(await response.text());

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};

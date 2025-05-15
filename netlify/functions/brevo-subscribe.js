const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Verifica se é uma requisição POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método não permitido' };
  }

  try {
    const { email } = JSON.parse(event.body);

    // Envia os dados para o Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY // Chave segura
      },
      body: JSON.stringify({
        email: email,
        listIds: [3], // ID da sua lista no Brevo (substitua se necessário)
        updateEnabled: true
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao cadastrar email');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email cadastrado!' })
    };

  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};

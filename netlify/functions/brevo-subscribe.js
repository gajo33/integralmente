const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Verifica método HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    // Parse do corpo da requisição
    const { email } = JSON.parse(event.body);

    // Validação básica
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Por favor, insira um email válido' })
      };
    }

    // Requisição para a API do Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        listIds: [3], // ATUALIZE para seu ID real
        updateEnabled: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao cadastrar no Brevo');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: error.message || 'Erro ao processar inscrição'
      })
    };
  }
};

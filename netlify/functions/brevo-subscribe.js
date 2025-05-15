const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Debug: Log do evento recebido
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  try {
    // Verifica se é POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método não permitido' })
      };
    }

    // Extrai o email
    const { email } = JSON.parse(event.body);
    console.log('Attempting to subscribe:', email);

    // Validação básica
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido');
    }

    // Chamada para API do Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email,
        listIds: [3], // ATUALIZE PARA SEU ID REAL
        updateEnabled: true
      }),
      timeout: 5000 // 5 segundos
    });

    console.log('Brevo response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo error:', errorData);
      throw new Error(errorData.message || 'Erro na API Brevo');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Inscrito com sucesso!' })
    };

  } catch (error) {
    console.error('Full error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: 'Falha na inscrição: ' + error.message,
        details: error.response?.data || null
      })
    };
  }
};

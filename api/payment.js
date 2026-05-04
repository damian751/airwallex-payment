export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const loginRes = await fetch('https://api.airwallex.com/api/v1/authentication/login', {
      method: 'POST',
      headers: {
        'x-client-id': 'y9zgBBcFSYSnbnkHunEoqA',
        'x-api-key': '658e91de88c8e338355bca8a97bc8debafba4387ba6cf92789834fd13414645620d78f4ca267592fdf6a5b916d5cf82b',
        'Content-Type': 'application/json'
      }
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    const timestamp = Date.now();
    const intentRes = await fetch('https://api.airwallex.com/api/v1/pa/payment_intents/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        request_id: `order_${timestamp}`,
        merchant_order_id: `order_${timestamp}`,
        amount: 1,
        currency: 'USD',
        order: {
          order_id: `order_${timestamp}`,
          description: 'Shopify payment'
        },
        return_url: 'https://zahayu.myshopify.com'
      })
    });
    const intentData = await intentRes.json();
    res.status(200).json({ client_secret: intentData.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

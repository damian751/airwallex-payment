export default async function handler(req, res) {
  try {
    const loginRes = await fetch('https://api.airwallex.com/api/v1/authentication/login', {
      method: 'POST',
      headers: {
        'x-client-id': 'bSIAR5m4TYWRM0tj94OrzA',
        'x-api-key': '90a226aa36fd04fdade2e1d47c1c05fa3ebd1810ca6238888f4bb77f4cc1e05dafb7fda509fb17b544fd7c1cb7a7cdfa',
        'Content-Type': 'application/json'
      }
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    const intentRes = await fetch('https://api.airwallex.com/api/v1/pa/payment_intents/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        request_id: `order_${Date.now()}`,
        merchant_order_id: `order_${Date.now()}`,
        amount: 1,
        currency: 'USD',
        order: { order_id: `order_${Date.now()}`, description: 'Shopify payment' },
        return_url: 'https://zahayu.myshopify.com'
      })
    });
    const intentData = await intentRes.json();
    res.status(200).json({ client_secret: intentData.client_secret });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
}

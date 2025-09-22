// pages/api/checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      
      res.status(200).json({
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_details: session.customer_details,
        payment_method_types: session.payment_method_types,
        payment_status: session.payment_status,
        metadata: session.metadata,
        subscription: session.subscription,
      });
    } catch (err) {
      console.error('Error retrieving checkout session:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
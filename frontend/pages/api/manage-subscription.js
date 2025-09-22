// pages/api/manage-subscription.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { customerId, action, subscriptionId } = req.body;

      switch (action) {
        case 'create_portal':
          // Create a customer portal session for subscription management
          const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${req.headers.origin}/dashboard`,
          });
          
          res.status(200).json({ url: portalSession.url });
          break;

        case 'cancel_subscription':
          // Cancel subscription at period end
          const cancelledSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
          });
          
          res.status(200).json({ 
            message: 'Subscription will be cancelled at the end of the billing period',
            subscription: cancelledSubscription 
          });
          break;

        case 'reactivate_subscription':
          // Reactivate a cancelled subscription
          const reactivatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: false,
          });
          
          res.status(200).json({ 
            message: 'Subscription reactivated',
            subscription: reactivatedSubscription 
          });
          break;

        case 'get_subscription':
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          res.status(200).json({ subscription });
          break;

        default:
          res.status(400).json({ error: 'Invalid action' });
      }
    } catch (err) {
      console.error('Subscription management error:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
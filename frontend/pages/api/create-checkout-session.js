import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { priceId, email, mode = "subscription", redirectToCheckout = false } = req.body || {};

    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    const origin = req.headers.origin || req.headers.host;

    const sessionConfig = {
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode, // Can be 'payment' or 'subscription'
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: mode === "payment" 
        ? `${origin}/?canceled=true` 
        : `${origin}/pricing`,
      billing_address_collection: 'required', // Collect billing address
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'SE', 'DK', 'NO', 'FI'], // Add countries as needed
      },
    };

    // Add customer_email only if provided (avoid undefined)
    if (email) {
      sessionConfig.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Feature from Code 1: Direct redirect option
    if (redirectToCheckout) {
      return res.redirect(303, session.url);
    }

    // Default behavior: Return session ID for frontend handling
    return res.status(200).json({ sessionId: session.id, url: session.url });
    
  } catch (err) {
    console.error("Stripe error:", err.message);
    return res.status(500).json({ 
      error: err.message,
      statusCode: err.statusCode || 500 
    });
  }
}
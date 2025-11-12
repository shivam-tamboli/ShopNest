import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY, {
      // Advanced configuration for better loading
      betas: ['custom_checkout_beta_4']
    });
  }
  return stripePromise;
};

export default getStripe;

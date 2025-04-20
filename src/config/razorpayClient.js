const Razorpay = require('razorpay');

apiKey ="rzp_test_RDUpcgbqEK50pY";
key_secret = "nNgcrWBRQmpgixib6x4lcfqd";

export const razorpay = new Razorpay({
  key_id: apiKey,
  key_secret: key_secret,
});




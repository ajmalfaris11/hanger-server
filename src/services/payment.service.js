const razorpay = require("../config/razorpayClient");
const orderService = require("../services/order.service.js");
const cartService = require("./cart.service.js");


const createPaymentLink = async (orderId) => {
  const isProduction = process.env.NODE_ENV === 'production'; 
  const baseUrl = isProduction
    ? 'https://hanger-client.vercel.app'
    : 'http://localhost:3000';

  try {
    const order = await orderService.findOrderById(orderId);

    const paymentLinkRequest = {
      amount: order.totalDiscountedPrice * 100,
      currency: 'INR',
      customer: {
        name: order.user.firstName + ' ' + order.user.lastName,
        contact: order.user.mobile,
        email: order.user.email,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: `${baseUrl}/payment/${orderId}`,
      callback_method: 'get',
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

    return {
      paymentLinkId: paymentLink.id,
      payment_link_url: paymentLink.short_url,
    };
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw new Error(error.message);
  }
};

const updatePaymentInformation = async (reqData) => {
  const paymentId = reqData.payment_id;
  const orderId = reqData.order_id;

  try {
    const order = await orderService.findOrderById(orderId);

    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status === 'captured') {
      order.paymentDetails.paymentId = paymentId;
      order.paymentDetails.status = 'COMPLETED';
      order.orderStatus = 'PLACED';

      await order.save();

      // ✅ Clear the cart after payment is captured
      await cartService.clearCart(order.user._id); 
    }

    console.log('payment status', order);
    return { message: 'Your order is placed', success: true };
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error(error.message);
  }
};


module.exports = { createPaymentLink, updatePaymentInformation };

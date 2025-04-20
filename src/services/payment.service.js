const razorpay = require("../config/razorpayClient");
const orderService=require("../services/order.service.js");

const createPaymentLink= async (orderId)=>{
    // const { amount, currency, receipt, notes } = reqData;
    

    try {
        
        const order = await orderService.findOrderById(orderId);
    
        const paymentLinkRequest = {
          amount: order.totalPrice * 100,
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
          callback_url: `https://localhost:3000/payment/${orderId}`,
          callback_method: 'get',
        };
    
        const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
    
        const paymentLinkId = paymentLink.id;
        const payment_link_url = paymentLink.short_url;
    
     
    
        // Return the payment link URL and ID in the response
        const resData = {
          paymentLinkId: paymentLinkId,
          payment_link_url,
        };
        return resData;
      } catch (error) {
        console.error('Error creating payment link:', error);
        throw new Error(error.message);
      }
}


module.exports={createPaymentLink}
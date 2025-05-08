const paymentService=require("../services/payment.service.js")
const cartService = require("../services/cart.service.js");


const createPaymentLink=async(req,res)=>{

    try {
        const paymentLink=await paymentService.createPaymentLink(req.params.id);
        return res.status(200).send(paymentLink)
    } catch (error) {
        return res.status(500).send(error.message);
    }

}

const updatePaymentInformation = async (req, res) => {
    try {
      const isPaid = await paymentService.updatePaymentInformation(req.query);
  
      if (isPaid && req.query.userId) {
        // Clear the cart after successful payment
        await cartService.clearCart(req.query.userId);
      }
  
      return res.status(200).send({ message: "Payment information updated", status: true });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };
  

module.exports={createPaymentLink,updatePaymentInformation}
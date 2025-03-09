const orderService = require("../services/order.service.js");

const createOrder = async (req, res) => {
  const user = req.user;
  // console.log("userr ",user,req.body)
  try {
    let createdOrder = await orderService.createOrder(user, req.body);

    console.log("order ", createdOrder);

    return res.status(201).send(createdOrder);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { createOrder };

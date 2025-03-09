const orderService = require("../services/order.service");

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(202).send(orders);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
};

// Confirm an order by ID
const confirmedOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.confirmedOrder(orderId);
    res.status(202).json(order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Mark an order as shipped
const shipOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.shipOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Mark an order as delivered
const deliverOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.deliveredOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Cancel an order by ID
const canceledOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.cancelledOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    await orderService.deleteOrder(orderId);
    res.status(202).json({ message: "Order Deleted Successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getAllOrders,
  confirmedOrder,
  shipOrder,
  deliverOrder,
  canceledOrder,
  deleteOrder,
};

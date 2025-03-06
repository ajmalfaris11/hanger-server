const cartService = require("../services/cart.service.js");
const Address = require("../models/address.model.js");
const OrderItem = require("../models/orderItems.js");
const Order = require("../models/order.model.js");

//  Create a new order for a user
async function createOrder(user, shippAddress) {
  let address;
  if (shippAddress._id) {
    let existedAddress = await Address.findById(shippAddress._id);
    address = existedAddress;
  } else {
    address = new Address(shippAddress);
    address.user = user;
    await address.save();

    user.addresses.push(address);
    await user.save();
  }

  const cart = await cartService.findUserCart(user._id);
  const orderItems = [];

  for (const item of cart.cartItems) {
    const orderItem = new OrderItem({
      price: item.price,
      product: item.product,
      quantity: item.quantity,
      size: item.size,
      userId: item.userId,
      discountedPrice: item.discountedPrice,
    });

    const createdOrderItem = await orderItem.save();
    orderItems.push(createdOrderItem);
  }

  const createdOrder = new Order({
    user,
    orderItems,
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discounte: cart.discounte,
    totalItem: cart.totalItem,
    shippingAddress: address,
    orderDate: new Date(),
    orderStatus: "PENDING", // Assuming OrderStatus is a string enum or a valid string value
    "paymentDetails.status": "PENDING", // Assuming PaymentStatus is nested under 'paymentDetails'
    createdAt: new Date(),
  });

  const savedOrder = await createdOrder.save();

  // for (const item of orderItems) {
  //   item.order = savedOrder;
  //   await item.save();
  // }

  return savedOrder;
}

async function placedOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "PLACED";
  order.paymentDetails.status = "COMPLETED";
  return await order.save();
}

async function confirmedOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "CONFIRMED";
  return await order.save();
}

async function shipOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "SHIPPED";
  return await order.save();
}

async function deliveredOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "DELIVERED";
  return await order.save();
}

module.exports = { createOrder, placedOrder, confirmedOrder, shipOrder, deliveredOrder };

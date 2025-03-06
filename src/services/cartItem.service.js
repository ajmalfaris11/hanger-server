const CartItem = require("../models/cartItem.model.js");

// Create a new cart item
async function createCartItem(cartItemData) {
  try {
    const cartItem = new CartItem(cartItemData);
    cartItem.quantity = 1;
    cartItem.price = cartItem.product.price * cartItem.quantity;
    cartItem.discountedPrice =
      cartItem.product.discountedPrice * cartItem.quantity;

    const createdCartItem = await cartItem.save();
    return createdCartItem;
  } catch (error) {
    throw new Error(error.message);
  }
}



module.exports = { createCartItem };
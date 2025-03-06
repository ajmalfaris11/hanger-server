const CartItem = require("../models/cartItem.model.js");
const userService = require("../services/user.service.js");

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

// Update an existing cart item
async function updateCartItem(userId, cartItemId, cartItemData) {
  try {
    const item = await findCartItemById(cartItemId);

    if (!item) {
      throw new Error("cart item not found : ", cartItemId);
    }
    const user = await userService.findUserById(item.userId);

    if (!user) {
      throw new Error("user not found : ", userId);
    }

    if (user.id === userId.toString()) {
      item.quantity = cartItemData.quantity;
      item.price = item.quantity * item.product.price;
      item.discountedPrice = item.quantity * item.product.discountedPrice;

      const updatedCartItem = await item.save();
      return updatedCartItem;
    } else {
      throw new Error("You can't update another user's cart_item");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

// Remove a cart item
async function removeCartItem(userId, cartItemId) {
  const cartItem = await findCartItemById(cartItemId);
  const user = await userService.findUserById(cartItem.userId);
  const reqUser = await userService.findUserById(userId);

  if (user.id === reqUser.id) {
    await CartItem.findByIdAndDelete(cartItem.id);
  } else {
    throw new UserException("You can't remove another user's item");
  }
}

// Find a cart item by its ID
async function findCartItemById(cartItemId) {
  const cartItem = await CartItem.findById(cartItemId).populate("product");
  if (cartItem) {
    return cartItem;
  } else {
    throw new CartItemException(`CartItem not found with id: ${cartItemId}`);
  }
}

module.exports = { createCartItem, updateCartItem, removeCartItem, findCartItemById };

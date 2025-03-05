const Cart = require("../models/cart.model.js");
const CartItem = require('path/to/cartItemModel');

// Create a new cart for a user
async function createCart(user) {
  try {
    const cart = new Cart({ user });
    const createdCart = await cart.save();
    return createdCart;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Find a user's cart and update cart details
async function findUserCart(userId) {
  try {
    let cart =await Cart.findOne({ user: userId })
  
    let cartItems=await CartItem.find({cart:cart._id}).populate("product")
  
    cart.cartItems=cartItems;
    
  
    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;
  
    for (const cartItem of cart.cartItems) {
      totalPrice += cartItem.price;
      totalDiscountedPrice += cartItem.discountedPrice;
      totalItem += cartItem.quantity;
    }
  
    cart.totalPrice = totalPrice;
    cart.totalItem = totalItem;
    cart.totalDiscountedPrice = totalDiscountedPrice;
    cart.discounte = totalPrice - totalDiscountedPrice;
  
    // const updatedCart = await cart.save();
    return cart;

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { createCart, findUserCart };

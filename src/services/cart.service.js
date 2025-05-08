const Cart = require("../models/cart.model.js");
const CartItem = require("../models/cartItem.model.js");
const Product = require("../models/product.model.js");
const User = require("../models/user.model.js");

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
    let cart = await Cart.findOne({ user: userId });

    let cartItems = await CartItem.find({ cart: cart._id }).populate("product");

    cart.cartItems = cartItems;

    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;
    let totalDiscount = 0;

    for (const cartItem of cart.cartItems) {
      totalPrice += cartItem.price;
      totalDiscountedPrice += cartItem.discountedPrice;
      totalItem += cartItem.quantity;
      totalDiscount += cartItem.price - cartItem.discountedPrice;
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

// Add an item to the user's cart
async function addCartItem(userId, req) {
  try {
    const cart = await Cart.findOne({ user: userId });
    const product = await Product.findById(req.productId);

    const isPresent = await CartItem.findOne({
      cart: cart._id,
      product: product._id,
      userId,
    });

    if (!isPresent) {
      const cartItem = new CartItem({
        product: product._id,
        cart: cart._id,
        quantity: 1,
        userId,
        price: product.price,
        size: req.size,
        discountedPrice: product.discountedPrice,
      });

      const createdCartItem = await cartItem.save();
      cart.cartItems.push(createdCartItem);
      await cart.save();
      return createdCartItem
    }

    return 
    ;

  } catch (error) {
    throw new Error(error.message);
  }
}

// Clear the user's cart after successful payment
async function clearCart(userId) {
  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) throw new Error("Cart not found");

    // Delete all CartItems linked to this cart
    await CartItem.deleteMany({ cart: cart._id });

    // Optionally reset cart summary values
    cart.totalPrice = 0;
    cart.totalItem = 0;
    cart.totalDiscountedPrice = 0;
    cart.discounte = 0;
    cart.cartItems = [];

    await cart.save();

    return { message: "Cart cleared successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
}


module.exports = { createCart, findUserCart, addCartItem, clearCart };

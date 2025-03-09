const express = require("express");
const router = express.Router();

const cartService = require("../services/cart.service.js");

// Retrieves the cart of the currently authenticated user.
const findUserCart = async (req, res) => {
  const user = req.user;
  try {
    const cart = await cartService.findUserCart(user.id);
    res.status(201).json(cart);
  } catch (error) {
    // Handle error here and send appropriate response
    res
      .status(500)
      .json({ message: "Failed to get user cart.", error: error.message });
  }
};

// Adds an item to the authenticated user's cart.
const addItemToCart = async (req, res) => {
  const user = req.user;
  try {
    await cartService.addCartItem(user._id.toString(), req.body);

    res
      .status(201)
      .json({ message: "Item Added To Cart Successfully", status: true });
  } catch (error) {
    // Handle error here and send appropriate response
    res
      .status(500)
      .json({ message: "Failed to add item to cart.", error: error.message });
  }
};

module.exports = { findUserCart, addItemToCart };

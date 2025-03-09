const express = require("express");
const router = express.Router();

const cartService = require("../services/cart.service.js");

const findUserCart = async (req, res) => {
    const user = req.user;
  try {
    const cart = await cartService.findUserCart(user.id);
    res.status(200).json(cart);
  } catch (error) {
    // Handle error here and send appropriate response
    res
      .status(500)
      .json({ message: "Failed to get user cart.", error: error.message });
  }
};


module.exports = { findUserCart };

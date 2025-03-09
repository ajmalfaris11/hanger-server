const cartItemService = require("../services/cartItem.service.js");

const updateCartItem = async (req, res) => {
  const user = req.user;

  try {
    const updatedCartItem = await cartItemService.updateCartItem(
      user._id,
      req.params.id,
      req.body
    );

    return res.status(200).send(updatedCartItem);
  } catch (err) {
    console.log("error", err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { updateCartItem };

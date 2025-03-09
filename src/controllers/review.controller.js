const reviewService = require("../services/review.service.js");

const createReview = async (req, res) => {
  const user = req.user;
  const reqBody = req.body;

  console.log(`product id ${reqBody.productId} - ${reqBody.review}`);

  try {
    const review = await reviewService.createReview(reqBody, user);

    return res.status(201).send(review);
  } catch (error) {
    console.log("error --- ", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { createReview };

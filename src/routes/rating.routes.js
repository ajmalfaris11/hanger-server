const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate.js");
const ratingController = require("../services/rating.service.js");

router.get("/create",authenticate,ratingController.createRating);
router.put("/product/:productId",authenticate,ratingController.getProductsRating);


module.exports=router;
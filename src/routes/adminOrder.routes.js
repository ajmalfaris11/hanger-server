const express=require("express");
const router=express.Router();

const adminOrderController = require("../controllers/adminOrder.controller.js")
const authenticate = require("../middleware/authenticate.js");

router.get("/",authenticate,adminOrderController.getAllOrders);
router.put("/:orderId/confirmed",authenticate,adminOrderController.confirmedOrder);
router.put("/:orderId/ship",authenticate,adminOrderController.shipOrder);
router.put("/:orderId/deliver",authenticate,adminOrderController.deliverOrder);
router.put("/:orderId/cancel",authenticate,adminOrderController.canceledOrder);
router.delete("/:orderId/delete",authenticate,adminOrderController.deleteOrder);

module.exports=router;
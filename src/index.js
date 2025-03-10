const express = require("express");
const cors = require("cors");
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for cross-origin requests
app.use(cors());

// Root route - Welcome message
app.get("/", (req, res) => {
  return res
    .status(200)
    .send({ message: "Welcome to Hanger E-commerce API - Node", status: true });
});

// Import and use authentication routes
const authRouters = require("./routes/auth.routes.js");
app.use("/auth", authRouters);

// Import and use user-related routes
const userRouters = require("./routes/user.routes.js");
app.use("/api/users", userRouters);

// Import and use product-related routes
const productRouter = require("./routes/product.routes.js");
app.use("/api/products", productRouter);

// Import and use admin-specific product routes
const adminProductRouter = require("./routes/adminProduct.routes.js");
app.use("/api/admin/products", adminProductRouter);

// Import and use cart-related routes
const cartRouter = require("./routes/cart.routes.js");
app.use("/api/cart", cartRouter);

// Import and use cart item-related routes
const cartItemRouter = require("./routes/cartItem.routes.js");
app.use("/api/cart_items", cartItemRouter);

// Import and use order-related routes
const orderRouter = require("./routes/order.routes.js");
app.use("/api/orders", orderRouter);

// Import and use review-related routes
const reviewRouter = require("./routes/review.routes.js");
app.use("/api/reviews", reviewRouter);

// Import and use rating-related routes
const ratingRouter = require("./routes/rating.routes.js");
app.use("/api/ratings", ratingRouter);

// Import and use admin-specific order routes
const adminOrderRoutes = require("./routes/adminOrder.routes.js");
app.use("/api/admin/orders", adminOrderRoutes);

// Export the app module
module.exports = { app };

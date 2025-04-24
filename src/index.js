const express = require("express");
const cors = require("cors");

const app = express();

// CORS options configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://hanger-client.vercel.app'
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware setup
app.use(cors(corsOptions));   // Enable CORS with custom options
app.use(express.json());      // Parse JSON request bodies

// Root route - Welcome message
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Welcome to Hanger E-commerce API - Node",
    status: true,
  });
});

// Import route modules
const authRouters = require("./routes/auth.routes.js");
const userRouters = require("./routes/user.routes.js");
const productRouter = require("./routes/product.routes.js");
const adminProductRouter = require("./routes/adminProduct.routes.js");
const cartRouter = require("./routes/cart.routes.js");
const cartItemRouter = require("./routes/cartItem.routes.js");
const orderRouter = require("./routes/order.routes.js");
const reviewRouter = require("./routes/review.routes.js");
const ratingRouter = require("./routes/rating.routes.js");
const adminOrderRoutes = require("./routes/adminOrder.routes.js");
const paymentRouter = require("./routes/payment.routes.js");

// Mount routes to their respective base paths
app.use("/auth", authRouters);
app.use("/api/users", userRouters);
app.use("/api/products", productRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/cart", cartRouter);
app.use("/api/cart_items", cartItemRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/payments", paymentRouter);

// Export the app
module.exports = { app };

const express = require("express");
const ordersRouter = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderForUser,
  deleteOrder
} = require("../db/orders");

ordersRouter.post("/", async (req, res, next) => {
  const { userId, productId, productTitle, count } = req.body;

  try {
    const createdOrder = await createOrder({ userId, productId, productTitle, count, orderStatus: "created" });
    res.send(createdOrder);
  } catch (error) {
    next(error);
  }
});

ordersRouter.get("/", async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.send(orders);
  } catch (error) {
    next(error);
  }
});

ordersRouter.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const orders = await getOrderForUser(userId);
    res.send(orders);
  } catch (error) {
    next(error);
  }
});

//GET - /:user_id
//Find all products associated to a user, using req.params.user_id, through the Carts table.
//If successful, respond with all products associated to user_id.

// ordersRouter.get("/:userId", async (req, res, next) => {
//   const { userId } = req.params;
//   try {
//     const orders = await getOrderForUser(userId);
//     res.send(orders);
//   } catch (error) {
//     next(error);
//   }
// });

// ordersRouter.get("/:orderId", async (req, res, next) => {
//   const { orderId } = req.params;
//   try {
//     const orders = await getOrderById(orderId);
//     res.send(orders);
//   } catch (error) {
//     next(error);
//   }
// });

//POST - /:user_id/:product_id or /
//Insert into Carts table


//DELETE - /:product_id
//Remove row from databse where columns user_id and product_id match req.params.user_id and req.params.product_id

ordersRouter.delete("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const updatedCart = await deleteOrder(orderId);
    res.send(updatedCart);
  } catch (error) {
    next(error);
  }
});

//need a post route that changes the status of the shopping cart to created, processing, cancelled, or completed
//add "type" to orders table?

module.exports = ordersRouter;

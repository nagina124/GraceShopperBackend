const express = require("express");
const ordersRouter = express.Router();
const {
  createOrder,
  addProductToOrder,
  getOrderById,
  deleteProductFromOrder,
  increaseCountOfProduct,
  getAllOrders,
  getOrderForUser,
} = require("../db/orders");

ordersRouter.post("/", async (req, res, next) => {
  const { productId, productTitle, count } = req.body;

  try {
    const createdOrder = await createOrder({ productId, productTitle, count });
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

ordersRouter.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const orders = await getOrderForUser(userId);
    res.send(orders);
  } catch (error) {
    next(error);
  }
});

//POST - /:user_id/:product_id or /
//Insert into Carts table

ordersRouter.post("/:orderId", async (req, res, next) => {
  // console.log(req.body)
  // console.log(req.user)
  const { orderId } = req.params;
  const { productId, productTitle, count, orderComplete } = req.body;

  try {
    const usersOrder = await getOrderById(orderId);
    const matchedProduct = usersOrder.filter((order) => {
      return productTitle === order.productTitle;
    });
    if (matchedProduct) {
      const increasedCount = await increaseCountOfProduct(productTitle);
      res.send(increasedCount);
    } else {
      const updatedCart = await addProductToOrder({
        orderId: usersOrder.id,
        productId,
        productTitle,
        count,
        orderComplete,
      });
      res.send(updatedCart);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//DELETE - /:product_id
//Remove row from databse where columns user_id and product_id match req.params.user_id and req.params.product_id

ordersRouter.delete("/:productId", async (req, res, next) => {
  const { productId } = req.params;
  try {
    const updatedCart = await deleteProductFromOrder(productId);
    res.send(updatedCart);
  } catch (error) {
    next(error);
  }
});

//need a post route that changes the status of the shopping cart to created, processing, cancelled, or completed
//add "type" to orders table?

module.exports = ordersRouter;

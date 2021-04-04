const express = require("express");
const {
  getAllProducts,
  createProduct,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} = require("../db/products");
const productsRouter = express.Router();
const { requireAdmin } = require("./utils");

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:category", async (req, res, next) => {
  const { category } = req.params;
  try {
    const products = await getProductsByCategory(category);
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/", async (req, res, next) => {
  // const { id } = req.admin; // we need to do some check for admin for functionality to work, this is placeholder code.
  const { category, title, productURL, description, price, inventory } = req.body;
  console.log("This is the req.admin test:", req.user);
  // if (!id) {
  //   res.status(401);
  //   next({
  //     name: "AuthorizationError",
  //     message: "You are not authorized to create a product",
  //   });
  // }
  try {
    const createdProduct = await createProduct({
      category,
      title,
      productURL, 
      description,
      price,
      inventory,
    });
    res.send(createdProduct);
  } catch (error) {
    next(error);
  }
});

productsRouter.patch("/:productId", async (req, res, next) => {
  // const { id } = req.admin; // **
  const { productId } = req.params;
  const { category, title, productURL, description, price, inventory } = req.body;
  // if (!id) {
  //   res.status(401);
  //   next({
  //     name: "AuthorizationError",
  //     message: "You are not authorized to create a product",
  //   });
  // }
  try {
    const updatedProduct = await updateProduct({
      id: productId,
      category,
      title,
      productURL, 
      description,
      price,
      inventory,
    });
    res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  // const { id } = req.admin; //**
  const { productId } = req.params;
  try {
    const deletedProduct = await deleteProduct(productId);
    res.send(deletedProduct);
  } catch (error) {
    next(error);
  }
});

module.exports = productsRouter;

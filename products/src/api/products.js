const httpStatus = require('http-status');
const ProductService = require("../services/product-service");
const UserAuth = require("./middlewares/auth");
const { PublishMessage } = require("../utils");
const { CUSTOMER_SERVICE, SHOPPING_SERVICE, } = require("../config");

module.exports = (app, channel) => {
  const service = new ProductService();

  // Route to create a new product
  app.post("/product/create", async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, supplier, banner } = req.body;
      
      // TODO: validation

      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        supplier,
        banner,
      });

      return res.status(httpStatus.CREATED).json(data);
    } catch (error) {
      console.error("Error creating product:", error);
      next(error);
    }
  });

  // Route to get products by category
  app.get("/category/:type", async (req, res, next) => {
    try {
      const type = req.params.type;
      const { data } = await service.GetProductsByCategory(type);
      return res.status(httpStatus.OK).json(data);
    } catch (error) {
      console.error("Error getting products by category:", error);
      next(error);
    }
  });

  // Route to get product description by ID
  app.get("/:id", async (req, res, next) => {
    try {
      const productId = req.params.id;
      const { data } = await service.GetProductDescription(productId);
      return res.status(httpStatus.OK).json(data);
    } catch (error) {
      console.error("Error getting product description:", error);
      next(error);
    }
  });

  // Route to get selected products by IDs
  app.post("/ids", async (req, res, next) => {
    try {
      const { ids } = req.body;
      const products = await service.GetSelectedProducts(ids);
      return res.status(httpStatus.OK).json(products);
    } catch (error) {
      console.error("Error getting selected products:", error);
      next(error);
    }
  });

  // Route to add a product to the wishlist
  app.put("/wishlist", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProductPayload(
        _id,
        { productId: req.body._id },
        "ADD_TO_WISHLIST"
      );

      PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
      
      res.status(httpStatus.OK).json(data.data.product);
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      next(error);
    }
  });

  // Route to remove a product from the wishlist
  app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const productId = req.params.id;
      const { data } = await service.GetProductPayload(
        _id,
        { productId },
        "REMOVE_FROM_WISHLIST"
      );

      PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));

      return res.status(httpStatus.OK).json(data.data.product);
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      next(error);
    }
  });

  // Route to add a product to the cart
  app.put("/cart", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProductPayload(
        _id,
        { productId: req.body._id, qty: req.body.qty },
        "ADD_TO_CART"
      );

      PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
      PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));

      const response = { product: data.data.product, unit: data.data.qty };
      return res.status(httpStatus.OK).json(response);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      next(error);
    }
  });

  // Route to remove a product from the cart
  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const productId = req.params.id;
      const { data } = await service.GetProductPayload(
        _id,
        { productId },
        "REMOVE_FROM_CART"
      );

      PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
      PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));

      const response = { product: data.data.product, unit: data.data.qty };
      return res.status(httpStatus.OK).json(response);
    } catch (error) {
      console.error("Error removing product from cart:", error);
      next(error);
    }
  });

  // Route to get top products and categories
  app.get("/", async (req, res, next) => {
    try {
      const { data } = await service.GetProducts();
      return res.status(httpStatus.OK).json(data);
    } catch (error) {
      console.error("Error getting top products and categories:", error);
      next(error);
    }
  });

  // Route to identify the service
  app.get("/whoami", (req, res, next) => {
    return res.status(httpStatus.OK)
      .json({ msg: "/ or /products : I am products Service" });
  });
};
import express from "express";
import {
  createProduct,
  getProducts,
  getProductBarcode,
  removeProduct,
} from "../controller/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/create-product/:userId", userAuth, createProduct);
router.get("/get-products/:userId", userAuth, getProducts);
router.get("/get-barcode/", userAuth, getProductBarcode);
router.delete("/delete-product", userAuth, removeProduct);

export default router;

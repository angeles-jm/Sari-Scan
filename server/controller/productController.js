import Product from "../models/Products.js";
import User from "../models/User.js";

export const createProduct = async (req, res) => {
  try {
    const { products } = req.body;
    const { userId } = req.params;

    console.log("UserId: ", userId);
    console.log("Product to add:", products);

    // Check if the product already exists
    let productToAdd = await Product.findOne({ barcode: products.barcode });

    if (!productToAdd) {
      // Create a new product if it doesn't exist
      productToAdd = new Product({ ...products });
      await productToAdd.save();
    }

    // Check if this product (id) is already associated with the user
    const userStoreWithProduct = await User.findOne({
      _id: userId,
      products: productToAdd._id,
    });
    console.log("This is the product", userStoreWithProduct);

    if (userStoreWithProduct) {
      return res.status(400).json({
        success: false,
        message: "A product with this barcode already exists for the user",
        existingProduct: productToAdd,
      });
    }

    // Add Product

    const updatedProduct = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { products: productToAdd._id },
      },
      { new: true }
    );
    console.log("Updated store:", updatedProduct);

    res.status(201).json({
      success: true,
      message: "Product Added.",
      product: productToAdd,
    });
  } catch (error) {
    console.log("Error adding products", error);
    res.status(500).json({
      message: "An unexpected error occurred while adding the product",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("products").exec();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const products = user.products;

    console.log(user.products);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error getting products.", error: error.message });
  }
};

export const getProductBarcode = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productBarcode } = req.query;

    const user = await User.findById(userId).populate("products").exec();

    /*
    IN MONGO DB
    The name before the colon is a field in the database document.
    The value after the colon is the value you want to match in that field.
    */

    const product = await Product.findOne({
      barcode: productBarcode, // this checks if the product exist
      _id: { $in: user.products }, // this confirms if the id of product exists in user.products
    });

    console.log("The product", product);

    if (!product) {
      return res.status(404).json({ message: "Product doesn't exist" });
    }

    res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting barcode.", error: error.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    console.log("Request user:", req.user); // Debug user
    console.log("Request query:", req.query); // Debug query

    const userId = req.user._id;
    const { productId } = req.query;

    console.log("User", userId);

    const user = await User.findById(userId).populate("products").exec();

    // Check if the product exists and belongs to the user
    const product = await Product.findOne({
      _id: productId, // Product ID
      _id: { $in: user.products }, // Ensure it belongs to the user's products
    });

    if (!product) {
      return res
        .status(401)
        .json({ success: false, message: "This is not user's product" });
    }

    // Remove product reference from the user's product list
    await User.findByIdAndUpdate(userId, {
      $pull: { products: productId },
    });

    // Optionally delete the product if it is not associated with any other users
    const isProductReferenced = await User.findOne({ products: productId });
    if (!isProductReferenced) {
      await Product.findByIdAndDelete(productId);
    }

    return res
      .status(200)
      .json({ success: true, message: "Successfully deleted!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting the product", error: error.message });
  }
};

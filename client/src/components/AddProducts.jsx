import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { CiBarcode } from "react-icons/ci";
import { AppContext } from "../context/AppContext";
import useProducts from "../hooks/useProducts";
import { toast } from "react-toastify";
import BarcodeModal from "./BarcodeModal";

const AddProducts = ({ onAddProduct }) => {
  axios.defaults.withCredentials = true;

  const { backendUrl, userData } = useContext(AppContext);

  // Custom hook for fetching product data and barcode from openfoodfacts
  const { product: item, error, fetchProduct } = useProducts();

  const [product, setProduct] = useState({
    barcode: "",
    name: "",
    imageUrl: "",
    price: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [isBarcodeVisible, setIsBarcodeVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // for closing the modal
  const handleCloseBarcodeModal = () => setIsBarcodeVisible(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: name === "price" ? parseFloat(value) : value, // Parse price as a number
    }));
  };

  // Use useEffect here to check if the value in modal changed
  useEffect(() => {
    if (item && Object.keys(item).length > 0) {
      setProduct((prevState) => ({
        barcode: item.barcode || prevState.barcode,
        name: item.brand || prevState.name,
        imageUrl: item.image_url || prevState.imageUrl,
        price: prevState.price, // Keep the existing price
      }));
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/products/create-product/${userData.user}`,
        { products: product }
      );
      toast.success(data.message);
      onAddProduct(data.product);

      setProduct({
        barcode: "",
        name: "",
        imageUrl: "",
        price: 0,
      });
      setShowModal(false);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium mb-4"
      >
        Add Products
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-5">
            <div className="flex justify-between items-center p-6 border-b">
              <h3>Create New Product</h3>
              <button onClick={() => setShowModal(false)}>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form className="p-6" onSubmit={handleSubmit}>
              {/* Alert error */}

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="barcode"
                  >
                    Barcode
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="text"
                      required
                      id="barcode"
                      name="barcode"
                      value={product.barcode}
                      onChange={handleChange}
                      placeholder="Barcode"
                      className="flex-grow min-w-0 border border-gray-300 rounded-none rounded-l-md px-3 py-2 sm:text-sm"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsBarcodeVisible(true);
                      }}
                      className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      <CiBarcode className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="imageUrl"
                  >
                    Image URL
                  </label>
                  <input
                    type="text"
                    required
                    id="imageUrl"
                    name="imageUrl"
                    value={product.imageUrl}
                    onChange={handleChange}
                    placeholder="Image"
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1 "
                    htmlFor="price"
                  >
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    required
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 sm:text-sm"
                  />
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-4 py-2 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                    }`}
                  >
                    {isLoading ? "Adding..." : "ADD PRODUCT"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {isBarcodeVisible && (
        <BarcodeModal
          onClose={handleCloseBarcodeModal}
          product={item}
          error={error}
          fetchProduct={fetchProduct}
        />
      )}
    </div>
  );
};

export default AddProducts;

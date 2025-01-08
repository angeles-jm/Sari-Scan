import React, { useCallback, useContext, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import ItemsList from "../components/ItemsList";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import AddProducts from "../components/AddProducts";

const Inventory = () => {
  axios.defaults.withCredentials = true;
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const { backendUrl, userData } = useContext(AppContext);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // ItemsList API call
  const storeProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/products/get-products/${userData.user}`
      );
      console.log(data);
      setAllProducts(data);
    } catch (error) {
      if (error.status === 500) throw new Error("Handle the undefined status");
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, userData.user]);

  useEffect(() => {
    storeProducts();
  }, [storeProducts, userData]);

  // Removing a product
  const handleProductDelete = async (productId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/products/delete-product?productId=${productId}`
      );

      storeProducts();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message || "Error deleting the product");
    }
  };

  const handleAddProduct = (newProduct) => {
    setAllProducts((prev) => [...prev, newProduct]);
  };

  return (
    <div className="flex flex-col justify-center bg-cover bg-center">
      {/* SEARCH FILTER */}
      <div className="mb-4 flex items-center gap-3 mx-5 my-3 px-5 py-2.5 rounded-md bg-gray-200 text-black">
        <form onSubmit={handleSearchSubmit}>
          <div className="flex items-center gap-3">
            <span>
              <CiSearch className="text-black" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-transparent outline-none"
              placeholder="Search Product"
              required
            />
          </div>
        </form>
      </div>

      <div className="mb-20">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        ) : (
          <ItemsList
            productsList={allProducts}
            searchQuery={searchQuery}
            onDeleteProduct={handleProductDelete}
          />
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 py-4">
        <div className="container mx-auto px-4 flex justify-center">
          <AddProducts onAddProduct={handleAddProduct} />
        </div>
      </div>
    </div>
  );
};

export default Inventory;

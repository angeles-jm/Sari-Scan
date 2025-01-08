import axios from "axios";
import { useMemo } from "react";
import { MdDelete, MdShoppingBag } from "react-icons/md";

const ItemsList = ({ productsList, searchQuery, onDeleteProduct }) => {
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(productsList)) return [];
    if (!searchQuery) return productsList;

    const query = searchQuery.toLowerCase().trim();

    return productsList.filter((product) => {
      // null checks and make sure product is an object
      if (!product || typeof product !== "object") return false;

      return (
        product.name?.toLowerCase().includes(query) ||
        product.price?.toString().includes(query) ||
        product.barcode?.toString().includes(query)
      );
    });
  }, [productsList, searchQuery]);

  if (!Array.isArray(productsList)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">Error loading products.</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">
          {searchQuery
            ? "No products found matching your search."
            : "No products available in this store."}
        </p>
      </div>
    );
  }

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDeleteProduct(productId);
    }
  };

  return (
    <div className="mx-5 my-2 ">
      {filteredProducts.map((product) => (
        <div
          key={product._id}
          className="mb-4 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          {console.log(filteredProducts)}
          <div className="flex items-center p-4">
            <div className="flex-shrink-0">
              <img
                src={
                  product?.imageUrl ||
                  "https://via.placeholder.com/150?text=No+Image"
                }
                alt={product?.name || "Product"}
                className="h-20 w-20 object-contain rounded-md"
              />
            </div>
            <div className="ml-4 flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {product?.name || "NO NAME"}
              </h3>
              <p className="text-emerald-600 font-medium mt-1">
                PHP{" "}
                {typeof product?.price === "number"
                  ? product.price.toFixed(2)
                  : "N/A"}
              </p>
            </div>
            <div className="flex-shrink-0 ml-4 space-x-2">
              <button
                onClick={() => handleDelete(product._id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-300 text-2xl "
              >
                <MdDelete />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsList;

import React, { useCallback, useContext, useEffect, useState } from "react";
import Barcode from "../pages/Barcode";
import { ShoppingCart, Scan, Trash2, Plus, Minus, X } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const StoreCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  const { backendUrl } = useContext(AppContext);

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleProductScanned = useCallback((scannedProduct) => {
    if (scannedProduct) {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.barcode === scannedProduct.barcode
        );
        if (existingItem) {
          const updatedItems = prevItems.map((item) =>
            item.barcode === scannedProduct.barcode
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          return updatedItems;
        }
        return [...prevItems, { ...scannedProduct, quantity: 1 }];
      });
    }
    setShowBarcodeScanner(false);
  }, []);

  // Increment/Decrement item quantity
  const updateItemQuantity = (barcode, change) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.barcode === barcode
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Clear all items in the cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 flex flex-col items-center">
          <span className="text-xs pb-1">Click this!</span>
          <button
            onClick={() => setShowBarcodeScanner(true)}
            className="bg-gray-200 text-blue-600 px-4 py-2 rounded-full flex items-center hover:bg-blue-100 transition duration-300 text-sm"
          >
            <Scan className="mr-2" /> Scan Product
          </button>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Your cart is empty. Scan a product to add items.
            </p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.barcode}
                  className="flex items-center bg-gray-50 p-3 rounded-lg"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">₱{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateItemQuantity(item.barcode, -1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.barcode, 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-2xl font-bold text-blue-600">
              ₱{calculateTotal().toFixed(2)}
            </span>
          </div>
          <button
            onClick={clearCart}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center"
          >
            <Trash2 className="mr-2" /> Clear Cart
          </button>
        </div>
      </div>

      {showBarcodeScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
            <div className="p-4 relative">
              <button
                onClick={() => setShowBarcodeScanner(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <Barcode
                onClose={() => setShowBarcodeScanner(false)}
                onScanned={handleProductScanned}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreCart;

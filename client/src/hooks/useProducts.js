import { useCallback, useState } from "react";

const useProducts = () => {
  const [product, setProduct] = useState({});
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async (barcode) => {
    if (!barcode) return;

    const url = `https://world.openfoodfacts.org/api/v3/product/${barcode}.json`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      if (!response.ok) return;

      const data = await response.json();
      const {
        code,
        product: { brands, image_url },
      } = data;

      setProduct({ barcode: code, brands, image_url });
      console.log();
      setError(null);
    } catch (error) {
      setError("Failed to fetch product information.");
      setProduct({});
      console.error(error);
    }
  }, []);

  return { product, error, fetchProduct };
};

export default useProducts;

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import ToggleButton from "../components/ToggleButton";
import { Camera, XCircle, Package } from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Barcode = ({ onClose, onScanned }) => {
  axios.defaults.withCredentials = true;

  const videoRef = useRef(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);

  // BARCODE PROCESS
  const [productBarcode, setProductBarcode] = useState("");
  const [scannedProducts, setScannedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const handleProductBarcode = useCallback(
    async (productBarcode) => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/products/get-barcode?productBarcode=${productBarcode}`
        );
        setProduct(data);

        if (data && typeof onScanned === "function") {
          onScanned(data);
          onClose();
        }
      } catch (error) {
        console.log(error);
        if (onScanned) return;
        if (error.status === 404) return toast.error("No products found");
        else toast.error("Server error");
      }
    },
    [backendUrl, onScanned, onClose]
  );

  const handleScannedBarcode = useCallback(
    async (barcode) => {
      console.log("Handling barcode:", barcode);
      setResult(barcode);
      setProduct(null);
      setError(null);
      setProductBarcode(barcode);
      setScannedProducts(barcode);

      await handleProductBarcode(barcode);
    },
    [setProductBarcode, handleProductBarcode]
  );

  useEffect(() => {
    if (scannedProducts && scannedProducts.length > 0) {
      const latestProduct = scannedProducts[scannedProducts.length - 1];
      console.log("Setting product:", latestProduct);
      setProduct(latestProduct);
    }
  }, [scannedProducts]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    reader.current.reset();
    setResult(null);
    setError(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const startDecoding = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError(null);

        reader.current.decodeFromStream(
          stream,
          videoRef.current,
          (result, err) => {
            if (!isMounted) return;
            if (result) {
              const barcode = result.getText();
              handleScannedBarcode(barcode);
            }
            if (err && !(err instanceof NotFoundException)) {
              console.error(err);
              setError("An error occurred while scanning. Please try again.");
            }
          }
        );
      } catch (e) {
        if (isMounted) {
          console.error("Failed to start camera:", e);
          setError(
            "Failed to start camera. Please check permissions and try again."
          );
        }
      }
    };

    if (isCameraActive) {
      startDecoding();
    } else {
      stopCamera();
    }

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isCameraActive, handleScannedBarcode, stopCamera]);

  const toggleCamera = () => {
    setIsCameraActive((prev) => !prev);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg border rounded-lg mt-2">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Barcode Scanner
      </h2>

      <div className="relative mb-4">
        {isCameraActive ? (
          <div className="relative w-full h-64 overflow-hidden rounded-lg">
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 scanner-guide">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 border-2 border-white rounded-lg"></div>
            </div>
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
            <Camera size={48} className="text-gray-400" />
          </div>
        )}
        <ToggleButton
          className={`absolute bottom-2 right-2 p-2 rounded-full ${
            isCameraActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white transition duration-300 ease-in-out`}
          onClick={toggleCamera}
        >
          {isCameraActive ? <XCircle size={24} /> : <Camera size={24} />}
        </ToggleButton>
      </div>

      {result && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
          <h3 className="font-semibold text-green-800">Scanned Barcode:</h3>
          <p className="text-green-700">{result}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {product && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Product Details
          </h3>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-contain rounded-lg mb-3"
            />
          )}
          <div className="space-y-2">
            <p>
              <span className="font-medium">Barcode:</span> {product.barcode}
            </p>
            <p>
              <span className="font-medium">Name:</span> {product.name}
            </p>
            <p>
              <span className="font-medium">Price:</span> ₱
              {typeof product.price === "number"
                ? product.price.toFixed(2)
                : "N/A"}
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center text-gray-500">
          <p>Loading...</p>
        </div>
      )}

      {!product && !error && !isLoading && (
        <div className="text-center text-gray-500">
          <Package size={48} className="mx-auto mb-2" />
          <p>Scan a barcode to see product details</p>
        </div>
      )}
    </div>
  );
};

export default Barcode;

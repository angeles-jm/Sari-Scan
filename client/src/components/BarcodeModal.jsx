import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { XCircle, Camera, AlertCircle } from "lucide-react";

const BarcodeModal = ({ onClose, product, error, fetchProduct }) => {
  const videoRef = useRef(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [result, setResult] = useState(null);
  const [lastBarcode, setLastBarcode] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  // const { product, error, fetchProduct } = useProducts();

  useEffect(() => {
    if (!videoRef.current) return;

    const startDecoding = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;

        reader.current.decodeFromConstraints(
          {
            audio: false,
            video: { facingMode: "environment" },
          },
          videoRef.current,
          (result, error) => {
            if (result) {
              const barcode = result.getText();
              if (barcode !== lastBarcode) {
                setLastBarcode(barcode);
                setResult(barcode);
                fetchProduct(barcode);
              }
            }
            if (error && !(error instanceof NotFoundException)) {
              console.error(error);
            }
          }
        );
      } catch (error) {
        console.error("Failed to start camera:", error);
      }
    };

    startDecoding();

    return () => {
      const currentReader = reader.current;
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }
      currentReader.reset();
    };
  }, [isCameraActive, fetchProduct, lastBarcode]);

  useEffect(() => {
    if (!isCameraActive) {
      onClose();
    }
  }, [isCameraActive, onClose]);

  const handleToggleCamera = () => {
    setIsCameraActive((prevState) => !prevState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Barcode Scanner
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video ref={videoRef} className="w-full h-full object-cover" />
            {!isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Camera className="h-12 w-12 text-white" />
              </div>
            )}
          </div>

          {result && (
            <div className="p-3 bg-green-100 rounded-lg">
              <p className="font-semibold text-green-800">Scanned Barcode:</p>
              <p className="text-green-700">{result}</p>
            </div>
          )}

          <button
            onClick={handleToggleCamera}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              isCameraActive
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isCameraActive ? "Close Camera" : "Open Camera"}
          </button>

          {product ? (
            <div className="space-y-2">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.code}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <p className="font-semibold">
                Barcode: <span className="font-normal">{product.barcode}</span>
              </p>
              <p className="font-semibold">
                Product Brand:{" "}
                <span className="font-normal">{product.brands}</span>
              </p>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-100 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BarcodeModal;

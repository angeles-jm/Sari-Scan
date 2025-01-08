import React, { useState } from "react";

const ImageLoading = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="h-20 w-20 rounded-md overflow-hidden relative bg-gray-200">
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-contain transform transition-opacity duration-500 ${
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default ImageLoading;

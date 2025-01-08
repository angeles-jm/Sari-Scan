import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const navigate = useNavigate();

  const { userData } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center mt-20 text-center text-gray-800">
      <img
        src={assets.header_img}
        alt=""
        className="w-36 h-36 rounded-full mb-6"
      />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        {userData && `Hey, ${userData.name}!`}
        {userData && (
          <img src={assets.hand_wave} className="w-8 aspect-square" />
        )}
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to SariScan!
      </h2>
      <p className="mb-8 max-w-md">
        Let&apos;s start with a tour and we will have you up and running in no
        time!
      </p>

      <button
        onClick={() => (userData ? navigate("/inventory") : navigate("/login"))}
        className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 translate-all"
      >
        Get Started
      </button>
    </div>
  );
};

export default Header;

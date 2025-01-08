import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// Icons
import { MdAddShoppingCart, MdOutlineInventory2 } from "react-icons/md";
import { CiBarcode } from "react-icons/ci";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContext);

  const data = [
    {
      id: 1,
      name: "Inventory",
      link: `/inventory`,
      icon: <MdOutlineInventory2 className="text-xl" />,
    },
    {
      id: 2,
      name: "Cart",
      link: "/cart",
      icon: <MdAddShoppingCart className="text-xl" />,
    },
    {
      id: 3,
      name: "Barcode",
      link: "/barcode",
      icon: <CiBarcode className="text-xl" />,
    },
  ];

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate("/");
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 bg-gray-100 ">
      <span
        className="text-lg font-medium cursor-pointer"
        onClick={() => navigate("/")}
      >
        SariScan
      </span>
      {userData ? (
        <>
          <div className="flex justify-between items-center py-3">
            {data.map((item) => (
              <NavLink
                to={item.link}
                key={item.id}
                className={({ isActive }) =>
                  `flex items-center rounded-lg gap-2 px-4 py-2 transition-colors duration-300  ${
                    isActive
                      ? " text-black bg-gray-200"
                      : "  hover:bg-emerald-600 hover:text-white"
                  }`
                }
              >
                <span className="">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
          <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
            {userData.name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                {/* To only display this when user is not verified */}
                {!userData.isAccountVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Verify email
                  </li>
                )}

                <li
                  onClick={logout}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;

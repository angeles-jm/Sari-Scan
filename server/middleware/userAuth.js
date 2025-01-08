import jwt from "jsonwebtoken";
import User from "../models/User.js";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Login again" });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedToken.id);

    if (decodedToken.id) {
      req.body.userId = decodedToken.id;
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized. Login again" });
    }

    next(); // Pass control to the next middleware
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;

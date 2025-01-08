import User from "../models/User.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        user: user._id,
        isAccountVerified: user.isAccountVerified,
        // I will add here to get the data of the products
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

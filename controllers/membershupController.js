export const getMembership = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      membership: user.membership,
    });
  } catch (error) {
    console.error("GET MEMBERSHIP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get membership",
    });
  }
};

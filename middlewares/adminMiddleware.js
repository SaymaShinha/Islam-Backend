// middleware/adminMiddleware.js
export const isAdmin = (req, res, next) => {
  console.log(req);
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

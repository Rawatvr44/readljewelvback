module.exports = function (req, res, next) {
  const { id, password } = req.body;

  // hard-coded credentials
  const ADMIN_ID = "aftab";
  const ADMIN_PASSWORD = "aftab123984";

  if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
    return next();
  }

  return res.status(401).json({ message: "Invalid admin credentials" });
};

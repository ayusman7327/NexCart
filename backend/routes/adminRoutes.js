const router = require("express").Router();
const {
  getDashboardStats,
  getAllOrders,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/orders", getAllOrders);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;

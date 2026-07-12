const router = require("express").Router();

const {upladPost, uploadPost} = require("../utils/cloudConfig")
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getCategories,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, uploadPost.single("image"), createProduct);
router.put("/:id", protect, adminOnly, uploadPost.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.post("/:id/reviews", protect, addReview);

module.exports = router;

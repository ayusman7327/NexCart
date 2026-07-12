import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getProducts } from "../api/axios";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const DEMO = {
  1: {
    _id: "1",
    name: "Smartphone",
    price: 699,
    category: "Electronics",
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=450&fit=crop",
    description:
      "Experience the latest in smartphone technology. Features a stunning display, powerful processor, and exceptional camera system. Compatible with all major carriers.",
  },
  2: {
    _id: "2",
    name: "Wireless Headphones",
    price: 99,
    category: "Electronics",
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=450&fit=crop",
    description:
      "High-quality wireless headphones with noise cancellation. Features include noise cancellation, Bluetooth connectivity, and 30-hour battery life.",
  },
  3: {
    _id: "3",
    name: "Running Shoes",
    price: 120,
    category: "Footwear",
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=450&fit=crop",
    description:
      "Lightweight and comfortable running shoes designed for performance. Breathable mesh upper and responsive cushioning.",
  },
  4: {
    _id: "4",
    name: "Laptop",
    price: 999,
    category: "Electronics",
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=450&fit=crop",
    description:
      "Powerful laptop for professionals and students. Features fast processor, ample RAM, and long battery life for all-day productivity.",
  },
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(DEMO[id] || null))
      .finally(() => setLoading(false));

    getProducts({ limit: 4 })
      .then((res) => setRelated(res.data?.products || res.data || []))
      .catch(() =>
        setRelated(
          Object.values(DEMO)
            .filter((p) => p._id !== id)
            .slice(0, 4),
        ),
      );
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.skeleton}></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.page}>
        <div
          style={{ ...styles.container, textAlign: "center", paddingTop: 60 }}
        >
          <i
            className="fas fa-box-open"
            style={{ fontSize: 64, color: "#ccc" }}
          ></i>
          <h2 style={{ color: "#666", marginTop: 16 }}>Product not found</h2>
          <Link to="/shop" style={styles.backBtn}>
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = product.image?.url?.startsWith("http")
    ? product.image.url
    : `http://localhost:5000/${product.image || "uploads/placeholder.jpg"}`;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Breadcrumb */}
        <nav style={styles.breadcrumb}>
          <Link to="/" style={styles.breadLink}>
            Home
          </Link>
          <i className="fas fa-chevron-right" style={styles.breadSep}></i>
          <Link to="/shop" style={styles.breadLink}>
            Shop
          </Link>
          <i className="fas fa-chevron-right" style={styles.breadSep}></i>
          <span style={{ color: "#888" }}>{product.name}</span>
        </nav>

        {/* Product Layout */}
        <div style={styles.productLayout}>
          {/* Image */}
          <div style={styles.imageSection}>
            <img
              src={imageUrl}
              alt={product.name}
              style={styles.mainImage}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/600x450?text=No+Image";
              }}
            />
          </div>

          {/* Info */}
          <div style={styles.infoSection}>
            <span style={styles.categoryBadge}>{product.category}</span>
            <h1 style={styles.productName}>{product.name}</h1>
            <div style={styles.price}>${product.price?.toFixed(2)}</div>

            <div style={styles.divider}></div>

            <p style={styles.description}>{product.description}</p>

            <div style={styles.divider}></div>

            {/* Stock */}
            <div style={styles.stockInfo}>
              <i
                className={`fas fa-${product.stock > 0 ? "check-circle" : "times-circle"}`}
                style={{
                  color: product.stock > 0 ? "#2E7D32" : "#E53935",
                  marginRight: 8,
                }}
              ></i>
              <span
                style={{
                  color: product.stock > 0 ? "#2E7D32" : "#E53935",
                  fontWeight: 500,
                }}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Quantity */}
            <div style={styles.quantityRow}>
              <span style={styles.label}>Quantity:</span>
              <div style={styles.qtyControl}>
                <button
                  style={styles.qtyBtn}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <span style={styles.qtyNum}>{quantity}</span>
                <button
                  style={styles.qtyBtn}
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock || 99, q + 1))
                  }
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actionRow}>
              <button
                style={{
                  ...styles.addToCartBtn,
                  ...(added ? styles.addedBtn : {}),
                }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {added ? (
                  <>
                    <i className="fas fa-check" style={{ marginRight: 8 }}></i>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <i
                      className="fas fa-cart-plus"
                      style={{ marginRight: 8 }}
                    ></i>
                    Add to Cart
                  </>
                )}
              </button>
              <Link to="/cart" style={styles.buyNowBtn}>
                <i className="fas fa-bolt" style={{ marginRight: 8 }}></i>Buy
                Now
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section style={{ marginTop: 60 }}>
            <h2 style={styles.relatedTitle}>You Might Also Like</h2>
            <div style={styles.relatedGrid}>
              {related
                .filter((p) => p._id !== id)
                .slice(0, 4)
                .map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f8f9fa", paddingBottom: 60 },
  container: { maxWidth: 1200, margin: "0 auto", padding: "24px 20px" },
  skeleton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    height: 500,
    marginTop: 20,
  },
  backBtn: {
    display: "inline-block",
    marginTop: 20,
    backgroundColor: "#111111",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 6,
    textDecoration: "none",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
    fontSize: 14,
  },
  breadLink: { textDecoration: "none", color: "#111111" },
  breadSep: { color: "#ccc", fontSize: 10 },
  productLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 40,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  imageSection: {
    backgroundColor: "#f5f5f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    maxHeight: 500,
  },
  infoSection: { padding: "36px 32px" },
  categoryBadge: {
    display: "inline-block",
    backgroundColor: "#e8eaf6",
    color: "#111111",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: "clamp(20px, 3vw, 28px)",
    fontWeight: 700,
    color: "#222",
    margin: "0 0 12px",
    lineHeight: 1.3,
  },
  price: { fontSize: 32, fontWeight: 800, color: "#111111", margin: "0 0 8px" },
  divider: { height: 1, backgroundColor: "#f0f0f0", margin: "20px 0" },
  description: { fontSize: 15, color: "#555", lineHeight: 1.7, margin: 0 },
  stockInfo: {
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  label: { fontSize: 14, fontWeight: 600, color: "#444", marginRight: 12 },
  quantityRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  qtyControl: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  qtyBtn: {
    width: 40,
    height: 40,
    border: "none",
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
    fontSize: 12,
    color: "#444",
    transition: "background 0.2s",
  },
  qtyNum: { width: 48, textAlign: "center", fontWeight: 600, fontSize: 16 },
  actionRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  addToCartBtn: {
    flex: 1,
    minWidth: 150,
    backgroundColor: "#111111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "14px 20px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  addedBtn: { backgroundColor: "#2E7D32" },
  buyNowBtn: {
    flex: 1,
    minWidth: 150,
    backgroundColor: "#E65100",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 8,
    padding: "14px 20px",
    fontSize: 15,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  relatedTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#222",
    marginBottom: 20,
  },
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 20,
  },
};

export default ProductDetail;

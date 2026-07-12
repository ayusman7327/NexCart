import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const imageUrl = product.image?.url?.startsWith("http")
    ? product.image.url
    : `http://localhost:5000/${product.image || "uploads/placeholder.jpg"}`;

  return (
    <div style={styles.card}>
      <Link to={`/product/${product._id}`} style={styles.imageLink}>
        <img
          src={imageUrl}
          alt={product.name}
          style={styles.image}
          // onError={(e) => { e.target.src = 'https://via.placeholder.com/300x220?text=No+Image'; }}
        />
      </Link>
      <div style={styles.body}>
        <Link to={`/product/${product._id}`} style={styles.nameLink}>
          <h3 style={styles.name}>{product.name}</h3>
        </Link>
        <p style={styles.category}>
          <i
            className="fas fa-tag"
            style={{ marginRight: 4, fontSize: 11 }}
          ></i>
          {product.category}
        </p>
        <div style={styles.footer}>
          <span style={styles.price}>
            <i className="fas fa-inr"></i> {product.price}
          </span>
          <button
            style={{ ...styles.addBtn, ...(added ? styles.addedBtn : {}) }}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <i className="fas fa-check" style={{ marginRight: 6 }}></i>Added
              </>
            ) : (
              <>
                <i className="fas fa-cart-plus" style={{ marginRight: 6 }}></i>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  imageLink: { display: "block" },
  image: {
    width: "100%",
    height: 300,
    objectFit: "cover",
    display: "block",
    backgroundColor: "#f5f5f5",
  },
  body: { padding: "14px 16px 16px" },
  nameLink: { textDecoration: "none" },
  name: {
    margin: "0 0 4px",
    fontSize: 15,
    fontWeight: 600,
    color: "#222",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  category: {
    margin: "0 0 12px",
    fontSize: 12,
    color: "#888",
    textTransform: "capitalize",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111111",
  },
  addBtn: {
    backgroundColor: "#111111",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 14px",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 500,
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
  addedBtn: {
    backgroundColor: "#2E7D32",
  },
};

export default ProductCard;

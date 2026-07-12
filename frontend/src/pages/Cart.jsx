import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>
            <i
              className="fas fa-shopping-cart"
              style={{ marginRight: 10, color: "#111111" }}
            ></i>
            Shopping Cart
          </h1>
          <div style={styles.emptyCart}>
            <i
              className="fas fa-shopping-bag"
              style={{ fontSize: 72, color: "#ddd", marginBottom: 20 }}
            ></i>
            <h2 style={{ color: "#666", margin: "0 0 8px" }}>
              Your cart is empty
            </h2>
            <p style={{ color: "#999", margin: "0 0 24px" }}>
              Looks like you haven't added anything yet.
            </p>
            <Link to="/shop" style={styles.shopBtn}>
              <i className="fas fa-store" style={{ marginRight: 8 }}></i>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          <i
            className="fas fa-shopping-cart"
            style={{ marginRight: 10, color: "#111111" }}
          ></i>
          Shopping Cart
          <span style={styles.itemCount}>
            {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
          </span>
        </h1>

        <div style={styles.layout}>
          {/* Cart Items */}
          <div style={styles.cartList}>
            <div style={styles.cartHeader}>
              <span style={{ flex: 2 }}>Product</span>
              <span style={styles.headerCell}>Quantity</span>
              <span style={styles.headerCell}>Price</span>
              <span style={{ width: 40 }}></span>
            </div>

            {cartItems.map((item) => {
              const imageUrl = item.image?.url?.startsWith("http")
                ? item.image.url
                : `http://localhost:5000/${item.image || ""}`;

              return (
                <div key={item._id} style={styles.cartItem}>
                  <div style={styles.itemInfo}>
                    <img
                      src={imageUrl}
                      alt={item.name}
                      style={styles.itemImage}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80x80?text=?";
                      }}
                    />
                    <div>
                      <Link to={`/product/${item._id}`} style={styles.itemName}>
                        {item.name}
                      </Link>
                      <p style={styles.itemCat}>{item.category}</p>
                      <p style={styles.itemPriceMobile}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div style={styles.itemQty}>
                    <select
                      style={styles.qtySelect}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item._id, Number(e.target.value))
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.itemPrice}>
                    <i className="fas fa-inr"></i>
                    {(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    style={styles.removeBtn}
                    onClick={() => removeFromCart(item._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              );
            })}

            <div style={styles.cartActions}>
              <Link to="/shop" style={styles.continueShopping}>
                <i className="fas fa-arrow-left" style={{ marginRight: 6 }}></i>
                Continue Shopping
              </Link>
              <button style={styles.clearCartBtn} onClick={clearCart}>
                <i className="fas fa-trash" style={{ marginRight: 6 }}></i>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div style={styles.summary}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>

            <div style={styles.summaryRow}>
              <span>
                Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
              <span>
                <i className="fas fa-inr"></i>
                {totalPrice.toFixed(2)}
              </span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: "#2E7D32" }}>
                <i className="fas fa-inr"></i>
                {totalPrice >= 500 ? "Free" : "40"}
              </span>
            </div>
            {totalPrice < 500 && (
              <div style={styles.freeShipHint}>
                <i className="fas fa-truck" style={{ marginRight: 6 }}></i>
                Add <i className="fas fa-inr"></i>
                {(500 - totalPrice).toFixed(2)} more for free shipping!
              </div>
            )}
            <div style={styles.divider}></div>
            <div style={styles.totalRow}>
              <span>Total</span>
              <span>
                <i className="fas fa-inr"></i>
                {(totalPrice + (totalPrice >= 500 ? 0 : 40)).toFixed(2)}
              </span>
            </div>

            <button style={styles.checkoutBtn} onClick={handleCheckout}>
              <i className="fas fa-lock" style={{ marginRight: 8 }}></i>
              Proceed to Checkout
            </button>

            <div style={styles.payIcons}>
              <i className="fab fa-cc-visa" style={styles.payIcon}></i>
              <i className="fab fa-cc-mastercard" style={styles.payIcon}></i>
              <i className="fab fa-cc-paypal" style={styles.payIcon}></i>
              <i className="fab fa-cc-stripe" style={styles.payIcon}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f8f9fa", paddingBottom: 60 },
  container: { maxWidth: 1200, margin: "0 auto", padding: "24px 20px" },
  title: {
    fontSize: "clamp(20px, 3vw, 28px)",
    fontWeight: 700,
    color: "#222",
    margin: "0 0 28px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  itemCount: {
    fontSize: 14,
    backgroundColor: "#e8eaf6",
    color: "#111111",
    padding: "4px 10px",
    borderRadius: 20,
    fontWeight: 500,
  },
  emptyCart: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "60px 20px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  shopBtn: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#111111",
    color: "#fff",
    textDecoration: "none",
    padding: "12px 28px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 15,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: 24,
    alignItems: "flex-start",
  },
  cartList: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  cartHeader: {
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #eee",
    fontSize: 13,
    fontWeight: 600,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerCell: { width: 100, textAlign: "center" },
  cartItem: {
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #f5f5f5",
    gap: 16,
  },
  itemInfo: {
    flex: 2,
    display: "flex",
    alignItems: "center",
    gap: 14,
    minWidth: 0,
  },
  itemImage: {
    width: 72,
    height: 72,
    objectFit: "cover",
    borderRadius: 8,
    flexShrink: 0,
    backgroundColor: "#f5f5f5",
  },
  itemName: {
    fontSize: 15,
    fontWeight: 600,
    color: "#222",
    textDecoration: "none",
    display: "block",
    marginBottom: 4,
  },
  itemCat: {
    fontSize: 12,
    color: "#999",
    margin: "0 0 4px",
    textTransform: "capitalize",
  },
  itemPriceMobile: {
    display: "none",
    fontSize: 14,
    fontWeight: 600,
    color: "#111111",
    margin: 0,
  },
  itemQty: { width: 100, display: "flex", justifyContent: "center" },
  qtySelect: {
    padding: "8px 10px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    backgroundColor: "#fff",
    width: 70,
  },
  itemPrice: {
    width: 100,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 16,
    color: "#111111",
  },
  removeBtn: {
    width: 36,
    height: 36,
    border: "none",
    backgroundColor: "#fef2f2",
    color: "#E53935",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  cartActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    flexWrap: "wrap",
    gap: 12,
  },
  continueShopping: {
    color: "#111111",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  clearCartBtn: {
    background: "none",
    border: "1px solid #E53935",
    color: "#E53935",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  summary: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 80,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#222",
    margin: "0 0 20px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  freeShipHint: {
    backgroundColor: "#e8f5e9",
    color: "#2E7D32",
    padding: "8px 12px",
    borderRadius: 6,
    fontSize: 13,
    marginTop: 8,
  },
  divider: { height: 1, backgroundColor: "#f0f0f0", margin: "16px 0" },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 18,
    fontWeight: 700,
    color: "#222",
    marginBottom: 20,
  },
  checkoutBtn: {
    width: "100%",
    backgroundColor: "#111111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "14px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    transition: "background 0.2s",
  },
  payIcons: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
  },
  payIcon: { fontSize: 28, color: "#aaa" },
};

export default Cart;

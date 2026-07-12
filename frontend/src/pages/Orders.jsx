import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserOrders } from "../api/axios";

const STATUS_COLORS = {
  pending: { bg: "#fff8e1", color: "#F57F17", icon: "fa-clock" },
  paid: { bg: "#e8f5e9", color: "#2E7D32", icon: "fa-check-circle" },
  shipped: { bg: "#e3f2fd", color: "#111111", icon: "fa-shipping-fast" },
  delivered: { bg: "#e8f5e9", color: "#1B5E20", icon: "fa-box-open" },
  cancelled: { bg: "#fef2f2", color: "#C62828", icon: "fa-times-circle" },
};

const DEMO_ORDERS = [
  {
    _id: "1023",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "shipped",
    totalPrice: 897,
    products: [
      {
        product: {
          name: "Smartphone",
          image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop",
        },
        quantity: 1,
      },
      {
        product: {
          name: "Wireless Headphones",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
        },
        quantity: 2,
      },
    ],
  },
  {
    _id: "1022",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    status: "delivered",
    totalPrice: 120,
    products: [
      {
        product: {
          name: "Running Shoes",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
        },
        quantity: 1,
      },
    ],
  },
  {
    _id: "1021",
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    status: "paid",
    totalPrice: 999,
    products: [
      {
        product: {
          name: "Laptop",
          image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=80&h=80&fit=crop",
        },
        quantity: 1,
      },
    ],
  },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getUserOrders()
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders(DEMO_ORDERS))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setExpanded((e) => (e === id ? null : id));

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingBox}>
            <i
              className="fas fa-spinner fa-spin"
              style={{ fontSize: 32, color: "#111111" }}
            ></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <i
              className="fas fa-box"
              style={{ marginRight: 10, color: "#111111" }}
            ></i>
            My Orders
          </h1>
          <span style={styles.count}>
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </span>
        </div>

        {orders.length === 0 ? (
          <div style={styles.empty}>
            <i
              className="fas fa-box-open"
              style={{ fontSize: 64, color: "#ddd", marginBottom: 20 }}
            ></i>
            <h3 style={{ color: "#666", margin: "0 0 8px" }}>No orders yet</h3>
            <p style={{ color: "#999", margin: "0 0 24px" }}>
              Start shopping to see your orders here!
            </p>
            <Link to="/shop" style={styles.shopBtn}>
              <i className="fas fa-store" style={{ marginRight: 8 }}></i>
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {orders.map((order) => {
              const statusStyle =
                STATUS_COLORS[order.status?.toLowerCase()] ||
                STATUS_COLORS.pending;
              const isExpanded = expanded === order._id;
              const date = new Date(order.createdAt).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" },
              );

              return (
                <div key={order._id} style={styles.orderCard}>
                  {/* Order Header */}
                  <div
                    style={styles.orderHeader}
                    onClick={() => toggle(order._id)}
                  >
                    <div style={styles.orderInfo}>
                      <div>
                        <span style={styles.orderId}>Order #{order._id}</span>
                        <span style={styles.orderDate}>
                          <i
                            className="fas fa-calendar-alt"
                            style={{ marginRight: 4 }}
                          ></i>
                          {date}
                        </span>
                      </div>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        <i
                          className={`fas ${statusStyle.icon}`}
                          style={{ marginRight: 6 }}
                        ></i>
                        {order.status?.charAt(0).toUpperCase() +
                          order.status?.slice(1)}
                      </span>
                    </div>
                    <div style={styles.orderMeta}>
                      <span style={styles.orderTotal}>
                        <i className="fas fa-inr"></i>
                        {order.totalPrice?.toFixed(2)}
                      </span>
                      <i
                        className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}
                        style={{ color: "#888", fontSize: 14 }}
                      ></i>
                    </div>
                  </div>

                  {/* Order Items (expanded) */}
                  {isExpanded && (
                    <div style={styles.orderBody}>
                      <div style={styles.itemsDivider}></div>
                      {order.products?.map((item, i) => {
                        const imgUrl = item.product?.image?.url.startsWith(
                          "http",
                        )
                          ? item.product.image.url
                          : `http://localhost:5000/${item.product?.image || ""}`;
                        return (
                          <div key={i} style={styles.orderItem}>
                            <img
                              src={imgUrl}
                              alt={item.product?.name}
                              style={styles.itemImg}
                              // onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                            />
                            <div style={styles.itemDetails}>
                              <p style={styles.itemName}>
                                {item.product?.name || "Product"}
                              </p>
                              <p style={styles.itemQty}>
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <span style={styles.itemPrice}>
                              $
                              {(
                                (item.product?.price || 0) * item.quantity
                              ).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}

                      <div style={styles.orderFooter}>
                        <div
                          style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                        >
                          <button style={styles.trackBtn}>
                            <i
                              className="fas fa-map-marker-alt"
                              style={{ marginRight: 6 }}
                            ></i>
                            Track Order
                          </button>
                          {order.status !== "cancelled" &&
                            order.status !== "delivered" && (
                              <button style={styles.cancelBtn}>
                                <i
                                  className="fas fa-times"
                                  style={{ marginRight: 6 }}
                                ></i>
                                Cancel
                              </button>
                            )}
                          {order.status === "delivered" && (
                            <button style={styles.reviewBtn}>
                              <i
                                className="fas fa-star"
                                style={{ marginRight: 6 }}
                              ></i>
                              Write Review
                            </button>
                          )}
                        </div>
                        <div style={styles.totalSummary}>
                          <span style={{ color: "#888", fontSize: 13 }}>
                            Order Total
                          </span>
                          <span style={styles.totalAmt}>
                            ${order.totalPrice?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f8f9fa", paddingBottom: 60 },
  container: { maxWidth: 900, margin: "0 auto", padding: "24px 20px" },
  loadingBox: { textAlign: "center", padding: "80px 0" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    fontSize: "clamp(20px, 3vw, 28px)",
    fontWeight: 700,
    color: "#222",
    margin: 0,
    display: "flex",
    alignItems: "center",
  },
  count: {
    backgroundColor: "#e8eaf6",
    color: "#111111",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 500,
  },
  empty: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "60px 20px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  shopBtn: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#111111",
    color: "#fff",
    textDecoration: "none",
    padding: "12px 24px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
  },
  ordersList: { display: "flex", flexDirection: "column", gap: 16 },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  orderHeader: {
    padding: "18px 24px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background 0.2s",
    gap: 12,
  },
  orderInfo: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    flex: 1,
  },
  orderId: {
    display: "block",
    fontSize: 15,
    fontWeight: 700,
    color: "#222",
    marginBottom: 4,
  },
  orderDate: { fontSize: 13, color: "#888" },
  statusBadge: {
    padding: "5px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
  orderMeta: { display: "flex", alignItems: "center", gap: 16 },
  orderTotal: { fontSize: 17, fontWeight: 700, color: "#111111" },
  orderBody: { padding: "0 24px 20px" },
  itemsDivider: { height: 1, backgroundColor: "#f0f0f0", margin: "0 0 16px" },
  orderItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "10px 0",
    borderBottom: "1px solid #fafafa",
  },
  itemImg: {
    width: 60,
    height: 60,
    objectFit: "cover",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  itemDetails: { flex: 1, minWidth: 0 },
  itemName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#333",
    margin: "0 0 4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemQty: { fontSize: 12, color: "#999", margin: 0 },
  itemPrice: {
    fontSize: 14,
    fontWeight: 700,
    color: "#111111",
    whiteSpace: "nowrap",
  },
  orderFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTop: "1px solid #f0f0f0",
    flexWrap: "wrap",
    gap: 12,
  },
  trackBtn: {
    padding: "8px 16px",
    backgroundColor: "#e8eaf6",
    color: "#111111",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
  },
  cancelBtn: {
    padding: "8px 16px",
    backgroundColor: "#fef2f2",
    color: "#E53935",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
  },
  reviewBtn: {
    padding: "8px 16px",
    backgroundColor: "#fff8e1",
    color: "#F57F17",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
  },
  totalSummary: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  totalAmt: { fontSize: 18, fontWeight: 800, color: "#111111" },
};

export default Orders;

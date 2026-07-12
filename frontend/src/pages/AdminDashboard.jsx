import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getDashboardStats,
} from "../api/axios";
const DEFAULT_STATS = {
  totalProducts: 0,
  totalOrders: 0,
  totalUsers: 0,
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    image: null,
  });
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [open, setOpen] = useState(false);
  const [orderView, setOrderView] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      const productsRes = await getProducts({ limit: 20 });
      setProducts(productsRes.data?.products || productsRes.data);
    } catch {
      setProducts([]);
    }

    try {
      const ordersRes = await getAllOrders();
      setOrders(ordersRes.data || []);
    } catch {
      setOrders([]);
    }

    try {
      const statsRes = await getDashboardStats();
      setStats(statsRes.data);
    } catch {
      setStats();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description || "",
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      if (editProduct) {
        await updateProduct(editProduct._id, formData);
      } else {
        await createProduct(formData);
      }

      setShowAddModal(false);
      fetchData();
    } catch (err) {
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          <i
            className="fas fa-tachometer-alt"
            style={{ marginRight: 10, color: "#111111" }}
          ></i>
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div style={styles.tabs}>
          {["dashboard", "products", "orders"].map((t) => (
            <button
              key={t}
              style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
              onClick={() => setTab(t)}
            >
              <i
                className={`fas fa-${
                  t === "dashboard"
                    ? "chart-bar"
                    : t === "products"
                      ? "box"
                      : "receipt"
                }`}
                style={{ marginRight: 6 }}
              ></i>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {tab === "dashboard" && (
          <>
            <div style={styles.statsGrid}>
              {[
                {
                  label: "Total Products",
                  value: stats.totalProducts,
                  icon: "fa-box",
                  color: "#111111",
                  bg: "#e3f2fd",
                },
                {
                  label: "Total Orders",
                  value: stats.totalOrders,
                  icon: "fa-receipt",
                  color: "#E65100",
                  bg: "#fff3e0",
                },
                {
                  label: "Total Users",
                  value: stats.totalUsers,
                  icon: "fa-users",
                  color: "#2E7D32",
                  bg: "#e8f5e9",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{ ...styles.statCard, backgroundColor: stat.bg }}
                >
                  <div style={{ ...styles.statIcon, color: stat.color }}>
                    <i className={`fas ${stat.icon}`}></i>
                  </div>
                  <div>
                    <p style={styles.statLabel}>{stat.label}</p>
                    <p style={{ ...styles.statValue, color: stat.color }}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.grid2}>
              {/* Recent Products */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Recent Products</h3>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Price</th>
                      <th style={styles.th}>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 10).map((p) => (
                      <tr key={p._id} style={styles.tr}>
                        <td style={styles.td}>{p.name}</td>
                        <td style={styles.td}>
                          <i className="fa-solid fa-inr"></i>
                          {p.price}
                        </td>
                        <td style={styles.td}>
                          <span style={styles.catBadge}>{p.category}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recent Orders */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Recent Orders</h3>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>Order ID</th>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order._id} style={styles.tr}>
                        <td style={styles.td}>{order._id}</td>
                        <td style={styles.td}>{order.user}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              backgroundColor:
                                order.status === "Shipped"
                                  ? "#e3f2fd"
                                  : "#e8f5e9",
                              color:
                                order.status === "Shipped"
                                  ? "#111111"
                                  : "#2E7D32",
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Products Tab */}
        {tab === "products" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Manage Products</h3>
              <button
                style={styles.addBtn}
                onClick={() => {
                  setEditProduct(null);
                  setForm({
                    name: "",
                    price: "",
                    category: "",
                    stock: "",
                    description: "",
                  });
                  setShowAddModal(true);
                }}
              >
                <i className="fas fa-plus" style={{ marginRight: 6 }}></i>
                Add Product
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} style={styles.tr}>
                      <td style={styles.td}>{p.name}</td>
                      <td style={styles.td}>
                        <i className="fa-solid fa-inr"></i>
                        {p.price}
                      </td>
                      <td style={styles.td}>
                        <span style={styles.catBadge}>{p.category}</span>
                      </td>
                      <td style={styles.td}>{p.stock}</td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            style={styles.editBtn}
                            onClick={() => handleEdit(p)}
                          >
                            <i
                              className="fas fa-edit"
                              style={{ marginRight: 4 }}
                            ></i>
                            Edit
                          </button>
                          <button
                            style={styles.deleteBtn}
                            onClick={() => handleDelete(p._id)}
                          >
                            <i
                              className="fas fa-trash"
                              style={{ marginRight: 4 }}
                            ></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Manage Orders</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Order ID</th>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={styles.tr}>
                      <td style={styles.td}>{order._id}</td>
                      <td style={styles.td}>{order.user}</td>
                      <td style={styles.td}>
                        <i className="fas fa-inr"></i>
                        {order.totalPrice}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor:
                              order.status === "pending"
                                ? "#e3f2fd"
                                : "#e8f5e9",
                            color:
                              order.status === "pending"
                                ? "#111111"
                                : "#2E7D32",
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => {
                            console.log(order);
                            setOrderView(order);
                            setOpen(true);
                          }}
                          style={styles.editBtn}
                        >
                          <i
                            className="fas fa-eye"
                            style={{ marginRight: 4 }}
                          ></i>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {open && orderView && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: 10 }}>Order Details</h2>

            <hr />

            {/* Order Info */}
            <p>
              <strong>Order ID:</strong> {orderView._id}
            </p>
            <p>
              <strong>Status:</strong> {orderView.status}
            </p>
            <p>
              <strong>Payment Method:</strong> {orderView.paymentMethod}
            </p>
            <p>
              <strong>Payment Status:</strong> {orderView.paymentStatus}
            </p>
            <p>
              <strong>Total Price:</strong> ₹{orderView.totalPrice}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(orderView.createdAt).toLocaleString()}
            </p>

            <hr />

            {/* Shipping Address */}
            <h3>Shipping Details</h3>
            <p>
              {orderView.shippingAddress.firstName}{" "}
              {orderView.shippingAddress.lastName}
            </p>
            <p>{orderView.shippingAddress.address}</p>
            <p>
              {orderView.shippingAddress.city},{" "}
              {orderView.shippingAddress.state},{" "}
              {orderView.shippingAddress.country}
            </p>
            <p>ZIP: {orderView.shippingAddress.zip}</p>
            <p>Phone: {orderView.shippingAddress.phone}</p>
            <p>Email: {orderView.shippingAddress.email}</p>

            <hr />

            {/* Products */}
            <h3>Products</h3>

            {orderView.products.map((item) => (
              <div key={item._id} style={styles.productRow}>
                <img
                  src={item.image.url}
                  alt={item.name}
                  style={styles.productImage}
                />
                <div>
                  <p>
                    <strong>{item.name}</strong>
                  </p>
                  <p>Price: ₹{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}

            <button onClick={() => setOpen(false)} style={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div
          style={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: 18 }}>
                {editProduct ? "Edit Product" : "Add Product"}
              </h3>
              <button
                style={styles.closeModal}
                onClick={() => setShowAddModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            {[
              {
                name: "name",
                label: "Product Name",
                placeholder: "Wireless Headphones",
              },
              { name: "price", label: `Price`, placeholder: "99" },
              {
                name: "category",
                label: "Category",
                placeholder: "Electronics",
              },
              { name: "stock", label: "Stock", placeholder: "10" },
            ].map((f) => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <input
                  style={styles.input}
                  value={form[f.name]}
                  onChange={(e) =>
                    setForm((fo) => ({ ...fo, [f.name]: e.target.value }))
                  }
                  placeholder={f.placeholder}
                />
              </div>
            ))}
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
                value={form.description}
                onChange={(e) =>
                  setForm((fo) => ({ ...fo, description: e.target.value }))
                }
                placeholder="Product description..."
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {form.previewImage ? (
                <img
                  src={form.previewImage}
                  style={styles.previewImage}
                  alt="Product Image"
                />
              ) : (
                ""
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Image</label>
            </div>
            <Button
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((fo) => ({
                  ...fo,
                  image: e.target.files[0],
                  previewImage: URL.createObjectURL(e.target.files[0]),
                }))
              }
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload Image
              <VisuallyHiddenInput type="file" multiple />
            </Button>
            <br />
            <br />

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button style={styles.saveBtn} onClick={handleSave}>
                {loading ? (
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{ marginRight: 6 }}
                  ></i>
                ) : (
                  <i className="fas fa-save" style={{ marginRight: 6 }}></i>
                )}
                {editProduct ? "Save Changes" : "Add Product"}
              </button>
              <button
                style={styles.cancelModalBtn}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  previewImage: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "contain",
    borderRadius: "8px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    width: "400px",
    maxHeight: "80vh",
    overflowY: "auto",
  },

  closeBtn: {
    marginTop: "20px",
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  page: { minHeight: "100vh", backgroundColor: "#f8f9fa", paddingBottom: 60 },
  container: { maxWidth: 1200, margin: "0 auto", padding: "24px 20px" },
  title: {
    fontSize: "clamp(20px, 3vw, 28px)",
    fontWeight: 700,
    color: "#222",
    margin: "0 0 24px",
    display: "flex",
    alignItems: "center",
  },
  tabs: {
    display: "flex",
    gap: 4,
    marginBottom: 28,
    borderBottom: "2px solid #e0e0e0",
    paddingBottom: 0,
  },
  tab: {
    padding: "10px 20px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: "#888",
    borderBottom: "2px solid transparent",
    marginBottom: -2,
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
  },
  tabActive: {
    color: "#111111",
    borderBottomColor: "#111111",
    fontWeight: 600,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    borderRadius: 12,
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  statIcon: { fontSize: 36 },
  statLabel: {
    fontSize: 13,
    color: "#666",
    margin: "0 0 4px",
    fontWeight: 500,
  },
  statValue: { fontSize: 28, fontWeight: 800, margin: 0 },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    marginBottom: 20,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#222",
    margin: "0 0 16px",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#f8f9fa" },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 600,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottom: "1px solid #f0f0f0",
  },
  tr: { borderBottom: "1px solid #f5f5f5", transition: "background 0.15s" },
  td: {
    padding: "12px 14px",
    fontSize: 14,
    color: "#444",
    verticalAlign: "middle",
  },
  catBadge: {
    backgroundColor: "#e8eaf6",
    color: "#111111",
    padding: "3px 10px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 500,
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
  },
  addBtn: {
    backgroundColor: "#111111",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  editBtn: {
    padding: "6px 12px",
    backgroundColor: "#e8eaf6",
    color: "#111111",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
  },
  deleteBtn: {
    padding: "6px 12px",
    backgroundColor: "#fef2f2",
    color: "#E53935",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "28px",
    width: "100%",
    maxWidth: 480,
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeModal: {
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#666",
  },
  formGroup: { marginBottom: 14 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#444",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fafafa",
    color: "#333",
  },
  saveBtn: {
    flex: 1,
    padding: "10px 20px",
    backgroundColor: "#111111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelModalBtn: {
    flex: 1,
    padding: "10px 20px",
    backgroundColor: "#f5f5f5",
    color: "#666",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  },
};

export default AdminDashboard;

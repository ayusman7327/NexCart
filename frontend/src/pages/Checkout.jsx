import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/axios";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { updateShippingAddress } from "../api/axios";
const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: user.shippingAddress.firstName,
    lastName: user.shippingAddress.lastName,
    email: user.shippingAddress.email,
    phone: user.shippingAddress.phone,
    address: user.shippingAddress.address,
    city: user.shippingAddress.city,
    state: user.shippingAddress.state,
    zip: user.shippingAddress.zip,
    country: "India",
    paymentMethod: "",
  });
  const [errors, setErrors] = useState({});
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  useEffect(() => {
    loadRazorpay();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email.trim()) errs.email = "Required";
    if (!form.address.trim()) errs.address = "Required";
    if (!form.city.trim()) errs.city = "Required";
    if (!form.zip.trim()) errs.zip = "Required";
    if (!form.paymentMethod) errs.paymentMethod = "Select a payment method";
    return errs;
  };
  const shipping = totalPrice >= 500 ? 0 : 40;
  const total = totalPrice + shipping;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((errs) => ({ ...errs, [e.target.name]: "" }));
  };

  const finalizeOrder = async () => {
    const shipping = totalPrice >= 500 ? 0 : 40;
    const total = totalPrice + shipping;
    await updateShippingAddress(form);
    await placeOrder({
      products: cartItems.map((i) => ({
        product: i._id,
        quantity: i.quantity,
      })),
      totalPrice: total,
      shippingAddress: form,
      paymentMethod: form.paymentMethod,
    });

    clearCart();
    setSuccess(true);
    setTimeout(() => navigate("/orders"), 2500);
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const shipping = totalPrice >= 500 ? 0 : 40;
      const totalAmount = totalPrice + shipping;

      if (form.paymentMethod === "Online") {
        if (!window.Razorpay) {
          alert("Razorpay SDK not loaded");
          return;
        }

        // Create order on backend
        const { data: order } = await axios.post(
          "http://localhost:5000/api/payment/create-order",
          { amount: totalAmount },
        );

        const options = {
          key: "rzp_test_SMEKkRSLp7xjVH",
          amount: order.amount,
          currency: "INR",
          name: "NexCart",
          description: "Payment Transaction",
          order_id: order.id,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post(
                "http://localhost:5000/api/payment/verify",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              );

              if (verifyRes.data.success) {
                await finalizeOrder();
                alert("Payment Successful!");
              } else {
                alert("Payment verification failed");
              }
            } catch (err) {
              console.error(err);
              alert("Payment verification failed");
            }
          },
          prefill: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#3399cc" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.error("Payment Failed:", response.error);
          alert(response.error.description);
        });
        rzp.open();
      } else {
        await finalizeOrder();
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 style={styles.successTitle}>Order Placed Successfully!</h2>
          <p style={styles.successText}>
            Thank you for your purchase. You'll receive a confirmation email
            shortly.
          </p>
          <p style={{ color: "#888", fontSize: 14 }}>
            Redirecting to orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          <i
            className="fas fa-credit-card"
            style={{ marginRight: 10, color: "#111111" }}
          ></i>
          Checkout
        </h1>
        <div style={styles.layout}>
          {/* Form */}
          <div style={styles.formSection}>
            {/* Shipping Form */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>
                <i
                  className="fas fa-map-marker-alt"
                  style={{ marginRight: 8, color: "#111111" }}
                ></i>
                Shipping Address
              </h3>
              <div style={styles.formGrid}>
                {["firstName", "lastName"].map((f) => (
                  <div key={f} style={styles.formGroup}>
                    <label style={styles.label}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </label>
                    <input
                      style={{
                        ...styles.input,
                        ...(errors[f] ? styles.inputError : {}),
                      }}
                      name={f}
                      value={form[f]}
                      onChange={handleChange}
                      placeholder={f === "firstName" ? "John" : "Doe"}
                    />
                    {errors[f] && (
                      <span style={styles.errorMsg}>{errors[f]}</span>
                    )}
                  </div>
                ))}
              </div>
              <div style={styles.formGrid}>
                {["email", "phone"].map((f) => (
                  <div key={f} style={styles.formGroup}>
                    <label style={styles.label}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </label>
                    <input
                      style={{
                        ...styles.input,
                        ...(errors[f] ? styles.inputError : {}),
                      }}
                      name={f}
                      value={form[f]}
                      onChange={handleChange}
                      placeholder={
                        f === "email" ? "john@example.com" : "+91 9876543210"
                      }
                    />
                    {errors[f] && (
                      <span style={styles.errorMsg}>{errors[f]}</span>
                    )}
                  </div>
                ))}
              </div>
              {["address", "city", "state", "zip"].map((f) => (
                <div key={f} style={styles.formGroup}>
                  <label style={styles.label}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </label>
                  <input
                    style={{
                      ...styles.input,
                      ...(errors[f] ? styles.inputError : {}),
                    }}
                    name={f}
                    value={form[f]}
                    onChange={handleChange}
                    placeholder={f === "zip" ? "110001" : ""}
                  />
                  {errors[f] && (
                    <span style={styles.errorMsg}>{errors[f]}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Payment Method */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>
                <i
                  className="fas fa-wallet"
                  style={{ marginRight: 8, color: "#111111" }}
                ></i>
                Payment Method
              </h3>
              <div style={styles.paymentOptions}>
                {["Online", "COD"].map((opt) => (
                  <label
                    key={opt}
                    style={{
                      ...styles.payOption,
                      ...(form.paymentMethod === opt
                        ? styles.payOptionActive
                        : {}),
                    }}
                  >
                    <input
                      type="radio"
                      req
                      name="paymentMethod"
                      value={opt}
                      checked={form.paymentMethod === opt}
                      onChange={handleChange}
                      style={{ marginRight: 10, accentColor: "#111111" }}
                    />
                    {opt === "Online" ? (
                      <i
                        className="fas fa-mobile-alt"
                        style={{ marginRight: 8, color: "#111111" }}
                      ></i>
                    ) : (
                      <i
                        className="fas fa-money-bill-wave"
                        style={{ marginRight: 8, color: "#111111" }}
                      ></i>
                    )}
                    {opt === "Online" ? "Online Payment" : "Cash on Delivery"}
                  </label>
                ))}
                {errors.paymentMethod && (
                  <span style={styles.errorMsg}>{errors.paymentMethod}</span>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={styles.summary}>
            <h3 style={styles.cardTitle}>Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item._id} style={styles.summaryItem}>
                <img
                  src={item.image?.url || "https://via.placeholder.com/50"}
                  alt={item.name}
                  style={styles.summaryItemImg}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={styles.summaryItemName}>{item.name}</p>
                  <p style={styles.summaryItemQty}>Qty: {item.quantity}</p>
                </div>
                <span style={styles.summaryItemPrice}>
                  <i className="fas fa-inr"></i>
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div style={styles.divider}></div>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>
                <i className="fas fa-inr"></i>
                {totalPrice.toFixed(2)}
              </span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? "#2E7D32" : "#333" }}>
                <i className="fas fa-inr"></i>
                {shipping === 0 ? "Free" : `${shipping}`}
              </span>
            </div>
            <div style={styles.divider}></div>
            <div
              style={{
                ...styles.summaryRow,
                fontWeight: 700,
                fontSize: 18,
                color: "#222",
              }}
            >
              <span>Total</span>
              <span>
                <i className="fas fa-inr"></i>
                {total.toFixed(2)}
              </span>
            </div>
            <button
              style={styles.placeOrderBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{ marginRight: 8 }}
                  ></i>
                  Placing Order...
                </>
              ) : (
                <>
                  <i
                    className="fas fa-check-circle"
                    style={{ marginRight: 8 }}
                  ></i>
                  Place Order
                </>
              )}
            </button>
            <p style={styles.secureNote}>
              <i className="fas fa-lock" style={{ marginRight: 6 }}></i>
              Your payment is 100% secure
            </p>
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
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 24,
    alignItems: "flex-start",
  },
  formSection: { display: "flex", flexDirection: "column", gap: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#222",
    margin: "0 0 20px",
    display: "flex",
    alignItems: "center",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 0,
  },
  formGroup: { marginBottom: 16 },
  fullWidth: { gridColumn: "1 / -1" },
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
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    backgroundColor: "#fafafa",
  },
  inputError: { borderColor: "#E53935" },
  errorMsg: { fontSize: 12, color: "#E53935", marginTop: 4, display: "block" },
  paymentOptions: { display: "flex", flexDirection: "column", gap: 10 },
  payOption: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    border: "2px solid #eee",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    color: "#444",
    transition: "all 0.2s",
  },
  payOptionActive: { borderColor: "#111111", backgroundColor: "#f0f4ff" },
  summary: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 80,
  },
  summaryItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  summaryItemImg: {
    width: 50,
    height: 50,
    objectFit: "cover",
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
  },
  summaryItemName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#333",
    margin: "0 0 2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  summaryItemQty: { fontSize: 12, color: "#999", margin: 0 },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: 700,
    color: "#111111",
    whiteSpace: "nowrap",
  },
  divider: { height: 1, backgroundColor: "#f0f0f0", margin: "16px 0" },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  placeOrderBtn: {
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
    marginBottom: 12,
    marginTop: 8,
    transition: "background 0.2s",
  },
  secureNote: { textAlign: "center", color: "#888", fontSize: 13, margin: 0 },
  successBox: {
    maxWidth: 480,
    margin: "80px auto",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: "60px 40px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  successIcon: { fontSize: 72, color: "#2E7D32", marginBottom: 20 },
  successTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#222",
    margin: "0 0 12px",
  },
  successText: {
    color: "#666",
    fontSize: 15,
    margin: "0 0 16px",
    lineHeight: 1.6,
  },
};

export default Checkout;

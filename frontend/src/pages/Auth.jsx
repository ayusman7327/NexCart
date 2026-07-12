import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    const result = await login(form);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <i
            className="fas fa-shopping-bag"
            style={{ color: "#111111", fontSize: 32 }}
          ></i>
          <h2 style={styles.logoText}>NexCart</h2>
        </div>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to your account to continue</p>

        {error && (
          <div style={styles.errorBox}>
            <i
              className="fas fa-exclamation-circle"
              style={{ marginRight: 8 }}
            ></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <i className="fas fa-envelope" style={styles.inputIcon}></i>
              <input
                style={styles.input}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <label style={styles.label}>Password</label>
              <Link to="/forgotPassword" style={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
            <div style={styles.inputWrapper}>
              <i className="fas fa-lock" style={styles.inputIcon}></i>
              <input
                style={styles.input}
                type={showPwd ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPwd((s) => !s)}
              >
                <i className={`fas fa-eye${showPwd ? "-slash" : ""}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <i
                  className="fas fa-spinner fa-spin"
                  style={{ marginRight: 8 }}
                ></i>
                Signing In...
              </>
            ) : (
              <>
                <i
                  className="fas fa-sign-in-alt"
                  style={{ marginRight: 8 }}
                ></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.switchLink}>
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};
export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sendOtp, setSendOtp] = useState(false);
  const [otpVerifyed, setOtpVerifyed] = useState(false);
  const [form, setForm] = useState({
    email: "",
    otp: "",
  });
  const [Auth, setAuth] = useState({
    password: "",
    cpassword: "",
  });
  const handleSubmit = async (e) => {
    setError("");
    if (form.email === "") {
      setError("Email is required.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgotPassword",
        { email: form.email },
      );
      alert(res.data.message);

      setSendOtp(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const handleOtp = async (e) => {
    setError("");
    if (!form.otp) {
      setError("OTP is required.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/verifyOtp", {
        email: form.email,
        otp: form.otp,
      });
      alert(res.data.message);

      setOtpVerifyed(true);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };
  const handlePassword = async () => {
    try {
      if (!Auth.password || !Auth.cpassword) {
        setError("All fields are require");
        return;
      }
      if (Auth.password !== Auth.cpassword) {
        setError("Password must be same");
        return;
      }
      if (Auth.password.length < 6) {
        setError("Password length must be 6 digit");
        return;
      }
      const res = await axios.post(
        "http://localhost:5000/api/auth/createNewPassword",
        { password: Auth.password, email: form.email },
      );
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {otpVerifyed ? (
        <div style={styles.page}>
          <div style={styles.card}>
            <div style={styles.logo}>
              <i
                className="fas fa-shopping-bag"
                style={{ color: "#111111", fontSize: 32 }}
              ></i>
              <h2 style={styles.logoText}>NexCart</h2>
            </div>
            {error && (
              <div style={styles.errorBox}>
                <i
                  className="fas fa-exclamation-circle"
                  style={{ marginRight: 8 }}
                ></i>
                {error}
              </div>
            )}
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <i className="fas fa-lock" style={styles.inputIcon}></i>
                <input
                  style={styles.input}
                  type="text"
                  name="password"
                  value={Auth.password}
                  onChange={(e) => {
                    setAuth({ ...Auth, [e.target.name]: e.target.value });
                  }}
                  placeholder="Enter Password"
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <i className="fas fa-lock" style={styles.inputIcon}></i>
                <input
                  style={styles.input}
                  type="password"
                  name="cpassword"
                  value={Auth.cpassword}
                  onChange={(e) => {
                    setAuth({ ...Auth, [e.target.name]: e.target.value });
                  }}
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setLoading(true);
                handlePassword();
              }}
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{ marginRight: 8 }}
                  ></i>
                  Submit
                </>
              ) : (
                <>Submit</>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.page}>
          <div style={styles.card}>
            <div style={styles.logo}>
              <i
                className="fas fa-shopping-bag"
                style={{ color: "#111111", fontSize: 32 }}
              ></i>
              <h2 style={styles.logoText}>NexCart</h2>
            </div>
            {error && (
              <div style={styles.errorBox}>
                <i
                  className="fas fa-exclamation-circle"
                  style={{ marginRight: 8 }}
                ></i>
                {error}
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrapper}>
                <i className="fas fa-envelope" style={styles.inputIcon}></i>
                <input
                  style={styles.input}
                  type="email"
                  name="email"
                  disabled={sendOtp}
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </div>
            </div>
            {sendOtp ? (
              <div style={styles.formGroup}>
                <label style={styles.label}>OTP</label>
                <div style={styles.inputWrapper}>
                  <i className="fas fa-lock" style={styles.inputIcon}></i>
                  <input
                    style={styles.input}
                    type="number"
                    name="otp"
                    value={form.otp}
                    onChange={(e) =>
                      setForm({ ...form, [e.target.name]: e.target.value })
                    }
                    placeholder="Enter 6 digit OTP"
                  />
                </div>
              </div>
            ) : (
              ""
            )}

            <button
              onClick={() => {
                setLoading(true);
                sendOtp ? handleOtp() : handleSubmit();
              }}
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{ marginRight: 8 }}
                  ></i>
                  {sendOtp ? "Verifying..." : "Sending..."}
                </>
              ) : sendOtp ? (
                <> Verify </>
              ) : (
                <>Get OTP</>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <i
            className="fas fa-shopping-bag"
            style={{ color: "#111111", fontSize: 32 }}
          ></i>
          <h2 style={styles.logoText}>NexCart</h2>
        </div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join thousands of happy shoppers</p>

        {error && (
          <div style={styles.errorBox}>
            <i
              className="fas fa-exclamation-circle"
              style={{ marginRight: 8 }}
            ></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            {
              name: "name",
              label: "Full Name",
              icon: "fa-user",
              placeholder: "John Doe",
              type: "text",
            },
            {
              name: "email",
              label: "Email Address",
              icon: "fa-envelope",
              placeholder: "john@example.com",
              type: "email",
            },
          ].map((f) => (
            <div key={f.name} style={styles.formGroup}>
              <label style={styles.label}>{f.label}</label>
              <div style={styles.inputWrapper}>
                <i className={`fas ${f.icon}`} style={styles.inputIcon}></i>
                <input
                  style={styles.input}
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                />
              </div>
            </div>
          ))}

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <i className="fas fa-lock" style={styles.inputIcon}></i>
              <input
                style={styles.input}
                type={showPwd ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPwd((s) => !s)}
              >
                <i className={`fas fa-eye${showPwd ? "-slash" : ""}`}></i>
              </button>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrapper}>
              <i className="fas fa-lock" style={styles.inputIcon}></i>
              <input
                style={styles.input}
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <i
                  className="fas fa-spinner fa-spin"
                  style={{ marginRight: 8 }}
                ></i>
                Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus" style={{ marginRight: 8 }}></i>
                Create Account
              </>
            )}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.switchLink}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 20px",
    background: "linear-gradient(135deg, #f0f4ff 0%, #fff3e0 100%)",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  },
  logo: { textAlign: "center", marginBottom: 8 },
  logoText: {
    color: "#111111",
    margin: "8px 0 0",
    fontSize: 18,
    fontWeight: 700,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: "#222",
    margin: "20px 0 6px",
    textAlign: "center",
  },
  subtitle: {
    color: "#888",
    fontSize: 14,
    margin: "0 0 24px",
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fca5a5",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
  },
  formGroup: { marginBottom: 18 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#444",
    marginBottom: 6,
  },
  inputWrapper: { position: "relative" },
  inputIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#aaa",
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: "12px 14px 12px 40px",
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    backgroundColor: "#fafafa",
    color: "#333",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#aaa",
    cursor: "pointer",
    fontSize: 14,
    padding: 4,
  },
  forgotLink: { fontSize: 13, color: "#111111", textDecoration: "none" },
  submitBtn: {
    width: "100%",
    backgroundColor: "#111111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "14px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    transition: "background 0.2s",
    marginBottom: 20,
  },
  switchText: { textAlign: "center", fontSize: 14, color: "#666", margin: 0 },
  switchLink: { color: "#111111", fontWeight: 600, textDecoration: "none" },
};

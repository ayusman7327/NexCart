import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  Person,
  Menu,
  Close,
  Logout,
  Dashboard,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;
  const isAdmin = auth?.isAdmin;

  const handleLogout = () => {
    if (logout) {
      logout();
    }

    setMenuOpen(false);
    navigate("/");
  };

  const navLinkStyle = ({ isActive }) => ({
    ...styles.navLink,
    color: isActive ? "#000000" : "#555555",
    fontWeight: isActive ? 700 : 500,
    borderBottom: isActive ? "2px solid #000000" : "2px solid transparent",
  });

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>
            <ShoppingBag sx={{ fontSize: 22 }} />
          </span>

          <span>NexCart</span>
        </Link>

        <nav style={styles.desktopNavigation}>
          <NavLink to="/" style={navLinkStyle}>
            Home
          </NavLink>

          <NavLink to="/shop" style={navLinkStyle}>
            Shop
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" style={navLinkStyle}>
              Admin
            </NavLink>
          )}
        </nav>

        <div style={styles.actions}>
          <Link to="/cart" style={styles.cartButton} aria-label="Cart">
            <ShoppingCart sx={{ fontSize: 26 }} />
          </Link>

          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" style={styles.iconButton}>
                  <Dashboard sx={{ fontSize: 20 }} />
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                style={styles.signInButton}
              >
                <Logout sx={{ fontSize: 19 }} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" style={styles.signInButton}>
              <Person sx={{ fontSize: 20 }} />
              Sign In
            </Link>
          )}

          <button
            type="button"
            style={styles.menuButton}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Open navigation menu"
          >
            {menuOpen ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          <NavLink
            to="/"
            style={styles.mobileLink}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/shop"
            style={styles.mobileLink}
            onClick={() => setMenuOpen(false)}
          >
            Shop
          </NavLink>

          <NavLink
            to="/cart"
            style={styles.mobileLink}
            onClick={() => setMenuOpen(false)}
          >
            Cart
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              style={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              Admin Dashboard
            </NavLink>
          )}

          {!user && (
            <NavLink
              to="/auth"
              style={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </NavLink>
          )}

          {user && (
            <button
              type="button"
              style={styles.mobileLogout}
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e5e5",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  },

  container: {
    maxWidth: "1240px",
    minHeight: "76px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#111111",
    fontSize: "23px",
    fontWeight: 800,
    textDecoration: "none",
  },

  logoIcon: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    backgroundColor: "#111111",
    color: "#ffffff",
  },

  desktopNavigation: {
    display: "flex",
    alignItems: "center",
    gap: "34px",
  },

  navLink: {
    padding: "27px 2px 24px",
    textDecoration: "none",
    transition: "0.2s ease",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  cartButton: {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#111111",
    textDecoration: "none",
    borderRadius: "8px",
  },

  iconButton: {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f1f1",
    color: "#111111",
    borderRadius: "8px",
    textDecoration: "none",
  },

  signInButton: {
    minHeight: "42px",
    padding: "0 17px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "1px solid #111111",
    borderRadius: "8px",
    backgroundColor: "#111111",
    color: "#ffffff",
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: 700,
    textDecoration: "none",
    cursor: "pointer",
  },

  menuButton: {
    width: "42px",
    height: "42px",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    backgroundColor: "#f1f1f1",
    color: "#111111",
    borderRadius: "8px",
    cursor: "pointer",
  },

  mobileMenu: {
    padding: "14px 24px 22px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #eeeeee",
  },

  mobileLink: {
    padding: "12px",
    color: "#111111",
    textDecoration: "none",
    fontWeight: 600,
    borderRadius: "7px",
    backgroundColor: "#f5f5f5",
  },

  mobileLogout: {
    padding: "12px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#111111",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default Header;

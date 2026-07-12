import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, GitHub, LinkedIn, Email } from "@mui/icons-material";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.brandSection}>
          <Link to="/" style={styles.logo}>
            <span style={styles.logoIcon}>
              <ShoppingBag sx={{ fontSize: 21 }} />
            </span>
            NexCart
          </Link>

          <p style={styles.description}>
            A modern full-stack e-commerce platform offering secure shopping,
            product management and order tracking.
          </p>
        </div>

        <div>
          <h3 style={styles.heading}>Quick Links</h3>

          <div style={styles.links}>
            <Link to="/" style={styles.link}>
              Home
            </Link>

            <Link to="/shop" style={styles.link}>
              Shop
            </Link>

            <Link to="/cart" style={styles.link}>
              Cart
            </Link>

            <Link to="/auth" style={styles.link}>
              Sign In
            </Link>
          </div>
        </div>

        <div>
          <h3 style={styles.heading}>Contact</h3>

          <div style={styles.socialLinks}>
            <a
              href="mailto:ayushmanmishra855@gmail.com"
              style={styles.socialButton}
              aria-label="Email"
            >
              <Email />
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              style={styles.socialButton}
              aria-label="GitHub"
            >
              <GitHub />
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              style={styles.socialButton}
              aria-label="LinkedIn"
            >
              <LinkedIn />
            </a>
          </div>
        </div>
      </div>

      <div style={styles.bottom}>
        © {currentYear} NexCart. Built by Ayusman Mishra.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#090909",
    color: "#ffffff",
  },

  container: {
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "55px 24px",
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: "50px",
  },

  brandSection: {
    maxWidth: "480px",
  },

  logo: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: 800,
    textDecoration: "none",
  },

  logoIcon: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
    color: "#111111",
    backgroundColor: "#ffffff",
  },

  description: {
    margin: 0,
    maxWidth: "420px",
    color: "#bcbcbc",
    lineHeight: 1.7,
  },

  heading: {
    margin: "0 0 18px",
    fontSize: "17px",
  },

  links: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  link: {
    color: "#bcbcbc",
    textDecoration: "none",
  },

  socialLinks: {
    display: "flex",
    gap: "10px",
  },

  socialButton: {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    color: "#111111",
    textDecoration: "none",
  },

  bottom: {
    padding: "20px 24px",
    textAlign: "center",
    borderTop: "1px solid #292929",
    color: "#999999",
    fontSize: "14px",
  },
};

export default Footer;

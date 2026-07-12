import React from "react";
import { Link } from "react-router-dom";
import {
  PhoneIphone,
  Checkroom,
  MenuBook,
  Watch,
  ShoppingBag,
  ArrowForward,
  LocalShipping,
  Security,
  Replay,
  SupportAgent,
} from "@mui/icons-material";

const categories = [
  {
    name: "Electronics",
    icon: <PhoneIphone sx={{ fontSize: 38 }} />,
  },
  {
    name: "Footwear",
    icon: <ShoppingBag sx={{ fontSize: 38 }} />,
  },
  {
    name: "Clothing",
    icon: <Checkroom sx={{ fontSize: 38 }} />,
  },
  {
    name: "Books",
    icon: <MenuBook sx={{ fontSize: 38 }} />,
  },
  {
    name: "Accessories",
    icon: <Watch sx={{ fontSize: 38 }} />,
  },
];

const benefits = [
  {
    title: "Free Delivery",
    description: "Free delivery on eligible orders",
    icon: <LocalShipping sx={{ fontSize: 32 }} />,
  },
  {
    title: "Secure Payments",
    description: "Your transactions are protected",
    icon: <Security sx={{ fontSize: 32 }} />,
  },
  {
    title: "Easy Returns",
    description: "Simple and convenient returns",
    icon: <Replay sx={{ fontSize: 32 }} />,
  },
  {
    title: "Customer Support",
    description: "Support whenever you need it",
    icon: <SupportAgent sx={{ fontSize: 32 }} />,
  },
];

function Home() {
  return (
    <main style={styles.page}>
      {/* Hero section */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <p style={styles.smallHeading}>DISCOVER. SHOP. ENJOY.</p>

            <h1 style={styles.heroTitle}>
              Welcome to <span style={styles.highlight}>NexCart</span>
            </h1>

            <p style={styles.heroDescription}>
              Discover quality products, secure checkout and a smarter online
              shopping experience.
            </p>

            <Link to="/shop" style={styles.shopButton}>
              <ShoppingBag sx={{ fontSize: 20 }} />
              Shop Now
              <ArrowForward sx={{ fontSize: 20 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionLabel}>SHOP BY CATEGORY</p>
            <h2 style={styles.sectionTitle}>Browse Categories</h2>
          </div>

          <Link to="/shop" style={styles.viewAll}>
            View All
            <ArrowForward sx={{ fontSize: 18 }} />
          </Link>
        </div>

        <div style={styles.categoryGrid}>
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              style={styles.categoryCard}
            >
              <div style={styles.categoryIcon}>{category.icon}</div>
              <span style={styles.categoryName}>{category.name}</span>
              <span style={styles.categoryText}>Explore products</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products heading */}
      <section style={styles.featuredSection}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionLabel}>TRENDING NOW</p>
            <h2 style={styles.sectionTitle}>Featured Products</h2>
          </div>

          <Link to="/shop" style={styles.viewAll}>
            View All
            <ArrowForward sx={{ fontSize: 18 }} />
          </Link>
        </div>

        <div style={styles.featuredMessage}>
          <ShoppingBag sx={{ fontSize: 52 }} />

          <h3 style={styles.featuredTitle}>Explore our latest collection</h3>

          <p style={styles.featuredText}>
            Visit the shop to discover products selected for you.
          </p>

          <Link to="/shop" style={styles.blackButton}>
            Browse Products
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section style={styles.benefitsSection}>
        <div style={styles.benefitsGrid}>
          {benefits.map((benefit) => (
            <div key={benefit.title} style={styles.benefitCard}>
              <div style={styles.benefitIcon}>{benefit.icon}</div>

              <div>
                <h3 style={styles.benefitTitle}>{benefit.title}</h3>
                <p style={styles.benefitDescription}>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    color: "#111111",
  },

  hero: {
    minHeight: "520px",
    backgroundImage: 'url("/images/nexcart-hero.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  heroOverlay: {
    minHeight: "520px",
    display: "flex",
    alignItems: "center",
    background:
      "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.65) 48%, rgba(0,0,0,0.25) 100%)",
    padding: "40px 7%",
  },

  heroContent: {
    maxWidth: "680px",
    color: "#ffffff",
  },

  smallHeading: {
    margin: "0 0 14px",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: "#d8d8d8",
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(42px, 6vw, 72px)",
    lineHeight: 1.08,
    fontWeight: 800,
  },

  highlight: {
    color: "#ffffff",
  },

  heroDescription: {
    maxWidth: "600px",
    margin: "22px 0 30px",
    fontSize: "19px",
    lineHeight: 1.7,
    color: "#e7e7e7",
  },

  shopButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 24px",
    backgroundColor: "#ffffff",
    color: "#111111",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 700,
    border: "1px solid #ffffff",
  },

  section: {
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "70px 24px",
  },

  featuredSection: {
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "30px 24px 80px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "30px",
  },

  sectionLabel: {
    margin: "0 0 8px",
    color: "#666666",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "2px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "32px",
    color: "#111111",
  },

  viewAll: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#111111",
    textDecoration: "none",
    fontWeight: 700,
  },

  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
    gap: "18px",
  },

  categoryCard: {
    minHeight: "175px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "22px",
    border: "1px solid #dddddd",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
    color: "#111111",
    textDecoration: "none",
    boxShadow: "0 5px 18px rgba(0,0,0,0.05)",
  },

  categoryIcon: {
    width: "72px",
    height: "72px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "14px",
    borderRadius: "50%",
    color: "#ffffff",
    backgroundColor: "#111111",
  },

  categoryName: {
    fontSize: "17px",
    fontWeight: 700,
  },

  categoryText: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#777777",
  },

  featuredMessage: {
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center",
    borderRadius: "16px",
    backgroundColor: "#f4f4f4",
    color: "#111111",
  },

  featuredTitle: {
    margin: "15px 0 6px",
    fontSize: "24px",
  },

  featuredText: {
    margin: "0 0 22px",
    color: "#666666",
  },

  blackButton: {
    padding: "13px 22px",
    borderRadius: "8px",
    backgroundColor: "#111111",
    color: "#ffffff",
    fontWeight: 700,
    textDecoration: "none",
  },

  benefitsSection: {
    padding: "50px 24px",
    backgroundColor: "#111111",
    color: "#ffffff",
  },

  benefitsGrid: {
    maxWidth: "1240px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "30px",
  },

  benefitCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  benefitIcon: {
    width: "58px",
    height: "58px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    color: "#111111",
  },

  benefitTitle: {
    margin: "0 0 6px",
    fontSize: "17px",
  },

  benefitDescription: {
    margin: 0,
    color: "#cfcfcf",
    fontSize: "14px",
    lineHeight: 1.5,
  },
};

export default Home;

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/axios";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  "All",
  "Electronics",
  "Footwear",
  "Clothing",
  "Books",
  "Accessories",
];
const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A-Z" },
];

const DEMO_PRODUCTS = [
  {
    _id: "1",
    name: "Smartphone",
    price: 699,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    description: "Latest smartphone with amazing features.",
  },
  {
    _id: "2",
    name: "Wireless Headphones",
    price: 99,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    description: "High-quality wireless headphones.",
  },
  {
    _id: "3",
    name: "Running Shoes",
    price: 120,
    category: "Footwear",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    description: "Comfortable running shoes.",
  },
  {
    _id: "4",
    name: "Laptop",
    price: 999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    description: "Powerful laptop for all tasks.",
  },
  {
    _id: "5",
    name: "T-Shirt",
    price: 29,
    category: "Clothing",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    description: "Premium cotton t-shirt.",
  },
  {
    _id: "6",
    name: "Sunglasses",
    price: 49,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
    description: "Stylish UV-protection sunglasses.",
  },
  {
    _id: "7",
    name: "Novel - The Alchemist",
    price: 15,
    category: "Books",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
    description: "Bestselling novel by Paulo Coelho.",
  },
  {
    _id: "8",
    name: "Sneakers",
    price: 89,
    category: "Footwear",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
    description: "Casual everyday sneakers.",
  },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      if (sort) params.sort = sort;
      const res = await getProducts(params);
      setProducts(res.data?.products || res.data || []);
    } catch {
      // Use demo data
      let filtered = DEMO_PRODUCTS;
      if (search)
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        );
      if (category !== "All")
        filtered = filtered.filter((p) => p.category === category);
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredProducts = products.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "name_asc") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>
            <i
              className="fas fa-store"
              style={{ marginRight: 10, color: "#111111" }}
            ></i>
            Shop
          </h1>
          <p style={styles.resultCount}>
            {sortedProducts.length} products found
          </p>
        </div>

        {/* Search Bar */}
        <div style={styles.searchBar}>
          <i className="fas fa-search" style={styles.searchIcon}></i>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
          />
          {search && (
            <button style={styles.clearBtn} onClick={() => setSearch("")}>
              <i className="fas fa-times"></i>
            </button>
          )}
          <button
            style={styles.filterToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-sliders-h" style={{ marginRight: 6 }}></i>
            Filters
          </button>
        </div>

        <div style={styles.layout}>
          {/* Sidebar */}
          <aside
            style={{
              ...styles.sidebar,
              ...(sidebarOpen ? styles.sidebarOpen : {}),
            }}
          >
            <div style={styles.sidebarHeader}>
              <h3 style={styles.sidebarTitle}>
                <i
                  className="fas fa-filter"
                  style={{ marginRight: 8, color: "#111111" }}
                ></i>
                Filters
              </h3>
              <button
                style={styles.closeSidebar}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Category Filter */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterTitle}>Category</h4>
              {CATEGORIES.map((cat) => (
                <label key={cat} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    style={{ marginRight: 8, accentColor: "#111111" }}
                  />
                  {cat}
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterTitle}>
                Max Price: <i className="fas fa-inr"></i>
                {priceRange[1]}
              </h4>
              <input
                type="range"
                min={0}
                max={2000}
                step={50}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                style={{ width: "100%", accentColor: "#111111" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "#888",
                }}
              >
                <span>
                  <i className="fas fa-inr"></i>0
                </span>
                <span>
                  <i className="fas fa-inr"></i>2000
                </span>
              </div>
            </div>

            {/* Sort */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterTitle}>Sort By</h4>
              <select
                style={styles.select}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              style={styles.resetBtn}
              onClick={() => {
                setCategory("All");
                setSort("");
                setPriceRange([0, 2000]);
                setSearch("");
              }}
            >
              <i className="fas fa-redo" style={{ marginRight: 6 }}></i>
              Reset Filters
            </button>
          </aside>

          {/* Products Grid */}
          <main style={styles.main}>
            {/* Sort bar (desktop) */}
            <div style={styles.sortBar}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    style={{
                      ...styles.catChip,
                      ...(category === cat ? styles.catChipActive : {}),
                    }}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <select
                style={styles.sortSelect}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div style={styles.grid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} style={styles.skeleton}></div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div style={styles.empty}>
                <i
                  className="fas fa-search"
                  style={{ fontSize: 48, color: "#ccc", marginBottom: 16 }}
                ></i>
                <p style={{ color: "#888", fontSize: 16 }}>
                  No products found.
                </p>
                <button
                  style={styles.resetBtn}
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div style={styles.grid}>
                {sortedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f8f9fa", paddingBottom: 60 },
  container: { maxWidth: 1200, margin: "0 auto", padding: "24px 20px" },
  pageHeader: { marginBottom: 20 },
  pageTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: "#222",
    margin: "0 0 4px",
  },
  resultCount: { color: "#888", fontSize: 14, margin: 0 },
  searchBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "2px solid #e0e0e0",
    borderRadius: 10,
    padding: "0 16px",
    marginBottom: 24,
    gap: 8,
    transition: "border-color 0.2s",
  },
  searchIcon: { color: "#999", fontSize: 16 },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "14px 0",
    fontSize: 15,
    backgroundColor: "transparent",
    color: "#333",
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#999",
    cursor: "pointer",
    padding: "4px 8px",
    fontSize: 14,
  },
  filterToggle: {
    display: "none",
    backgroundColor: "#111111",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    alignItems: "center",
  },
  layout: {
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
  },
  sidebar: {
    width: 240,
    flexShrink: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 80,
  },
  sidebarOpen: {},
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sidebarTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: "#222" },
  closeSidebar: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666",
    fontSize: 16,
    display: "none",
  },
  filterSection: {
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: 16,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#444",
    margin: "0 0 10px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    cursor: "pointer",
  },
  select: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 14,
    color: "#444",
    outline: "none",
  },
  resetBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    color: "#555",
    fontWeight: 500,
  },
  main: { flex: 1, minWidth: 0 },
  sortBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },
  catChip: {
    padding: "6px 14px",
    borderRadius: 20,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
    color: "#555",
    transition: "all 0.2s",
  },
  catChipActive: {
    backgroundColor: "#111111",
    color: "#fff",
    borderColor: "#111111",
  },
  sortSelect: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 13,
    color: "#444",
    outline: "none",
    backgroundColor: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 20,
  },
  skeleton: {
    backgroundColor: "#e8e8e8",
    borderRadius: 12,
    height: 300,
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
};

export default Shop;

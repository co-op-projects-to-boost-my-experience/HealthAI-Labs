import React from "react";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        MedCare.<span style={styles.highlight}>AI</span>
      </div>
      <ul style={styles.navItems}>
        {["Home", "Tests", "Rays", "Ask Doctor", "News", "Reports", "About"].map((item) => (
          <li key={item} style={styles.navItem}>
            <a href={`#${item.toLowerCase().replace(" ", "")}`} style={styles.navLink}>
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 2rem",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "14px",
  },
  logo: {
    fontWeight: "600",
    color: "#333",
  },
  highlight: {
    color: "#1572E8",
    fontWeight: "700",
  },
  navItems: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: "1.5rem",
  },
  navLink: {
    color: "#333",
    textDecoration: "none",
    cursor: "pointer",
  },
};

export default Navbar;
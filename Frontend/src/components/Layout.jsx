import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* flexGrow: 1 pushes the footer down */}
      <main style={{ flexGrow: 1, padding: "20px" }}>
        {children}
      </main>

      <Footer />
    </div>
  );
}

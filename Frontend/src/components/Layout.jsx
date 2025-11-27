import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main
        style={{
          flexGrow: 1,
          padding: "20px",
          paddingTop: "100px", 
        }}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}

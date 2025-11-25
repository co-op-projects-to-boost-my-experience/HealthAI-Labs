import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Rays from "./pages/Rays";
import Report from "./pages/Report";
import About from "./pages/About";
import News from "./pages/News";
import Analysis from "./pages/Analysis";
import AskDoc from "./pages/AskDoc";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rays" element={<Rays />} />
        <Route path="/report" element={<Report />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/askdoctor" element={<AskDoc />} />
        <Route path="/contact" element={<Contact />} />
        {/* Catch-all route for undefined URLs */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

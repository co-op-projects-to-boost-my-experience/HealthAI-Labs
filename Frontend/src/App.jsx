import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Analysis from "./pages/Analysis";
import Rays from "./pages/Rays";
import Report from "./pages/Report";
import News from "./pages/News";
import AskDoc from "./pages/AskDoc";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Routes - Layout is handled inside each page component */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/rays" element={<Rays />} />
      <Route path="/report" element={<Report />} />
      <Route path="/news" element={<News />} />
      <Route path="/askdoctor" element={<AskDoc />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Auth routes without Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
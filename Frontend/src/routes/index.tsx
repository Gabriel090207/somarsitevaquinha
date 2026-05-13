import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";

import { Home } from "../pages/Home";

import { Crowdfunding } from "../pages/Crowdfunding/Crowdfunding";

import { Questions } from "../pages/Questions/Questions";

import { About } from "../pages/About/About";

export function AppRoutes() {
  return (
    <BrowserRouter>

      <Header />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/vaquinhas"
          element={<Crowdfunding />}
        />

        <Route
          path="/duvidas"
          element={<Questions />}
        />

        <Route
          path="/sobre"
          element={<About />}
        />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}
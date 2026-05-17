import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { Header } from "../components/Header/Header";

import { Footer } from "../components/Footer/Footer";

import { Login } from "../pages/Login/Login";

import { Home } from "../pages/Home";

import { Crowdfunding } from "../pages/Crowdfunding/Crowdfunding";

import { Questions } from "../pages/Questions/Questions";

import { About } from "../pages/About/About";

import { Profile } from "../pages/Profile/Profile";

import { Donations } from "../pages/Donations/Donations";

function Layout() {

  const location = useLocation();

const hideLayout =
  location.pathname === "/login";

  return (

    <>

    {!hideLayout && <Header />}

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

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

        <Route
  path="/perfil"
  element={<Profile />}
/>

<Route
  path="/minhas-doacoes"
  element={<Donations />}
/>

      </Routes>

     {!hideLayout && <Footer />}

    </>

  );
}

export function AppRoutes() {

  return (

    <BrowserRouter>

      <Layout />

    </BrowserRouter>

  );
}
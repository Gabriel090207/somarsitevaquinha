import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import {
  ScrollToTop,
} from "../components/ScrollToTop/ScrollToTop";

import { Header } from "../components/Header/Header";

import { Footer } from "../components/Footer/Footer";

import { Login } from "../pages/Login/Login";

import { Home } from "../pages/Home";

import { Crowdfunding } from "../pages/Crowdfunding/Crowdfunding";

import { Questions } from "../pages/Questions/Questions";

import { About } from "../pages/About/About";

import { Profile } from "../pages/Profile/Profile";

import { Donations } from "../pages/Donations/Donations";

import { Wallet } from "../pages/Wallet/Wallet";

import { Campaign } from "../pages/Campaign/Campaign";

import { MonthlyDonationPage } from "../pages/MonthlyDonation/MonthlyDonationPage";

import { Terms } from "../pages/Terms/Terms";

import { Privacy } from "../pages/Privacy/Privacy";

import { Contact } from "../pages/Contact/Contact";

import { Checkout } from "../pages/Checkout/Checkout";

import { PaymentSuccess } from "../pages/PaymentSuccess/PaymentSuccess";

import {
  MonthlyCheckout
} from "../pages/MonthlyCheckout/MonthlyCheckout";

import { MonthlySubscriptionSuccess } from "../pages/MonthlySubscriptionSuccess/MonthlySubscriptionSuccess";

import {
  EditMonthlyDonation
} from "../pages/EditMonthlyDonation/EditMonthlyDonation";

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
  path="/vaquinha/:slug"
  element={<Campaign />}
/>

<Route
  path="/checkout/:slug"
  element={<Checkout />}
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
  path="/termos-de-uso"
  element={<Terms />}
/>

<Route
  path="/politica-de-privacidade"
  element={<Privacy />}
/>

<Route
  path="/contato"
  element={<Contact />}
/>

        <Route
  path="/perfil"
  element={<Profile />}
/>

<Route
  path="/minhas-doacoes"
  element={<Donations />}
/>


<Route
  path="/minha-carteira"
  element={<Wallet />}
/>

<Route
  path="/doador-mensal"
  element={<MonthlyDonationPage />}
/>

<Route
  path="/payment-success"
  element={<PaymentSuccess />}
/>



<Route
  path="/monthly-checkout"
  element={<MonthlyCheckout />}
/>


<Route
  path="/monthly-subscription-success"
  element={
    <MonthlySubscriptionSuccess />
  }
/>

<Route
  path="/editar-doacao-mensal"
  element={
    <EditMonthlyDonation />
  }
/>


      </Routes>

     {!hideLayout && <Footer />}

    </>

  );
}

export function AppRoutes() {

  return (

    <BrowserRouter>

    <ScrollToTop />

      <Layout />

    </BrowserRouter>

  );
}
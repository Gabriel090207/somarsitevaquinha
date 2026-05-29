import "./Sidebar.css";

import logo from "../../assets/images/logo.png";

import {
  useState,
} from "react";

import {
  LayoutDashboard,
  HandHeart,
  Users,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  Repeat,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  signOut,
} from "firebase/auth";

import {
  useNavigate,
} from "react-router-dom";

import {
  auth,
} from "../../services/firebase";

import { useToast }
  from "../../contexts/ToastContext";

export function Sidebar() {

  const location =
    useLocation();

  const [menuOpen, setMenuOpen] =
    useState(false);

    const navigate =
  useNavigate();

const { showToast } =
  useToast();

  async function handleLogout() {

  try {

    await signOut(auth);

    showToast(
      "Logout realizado com sucesso!",
      "success"
    );

    navigate("/");

  } catch (error) {

    console.log(error);

    showToast(
      "Erro ao sair da conta.",
      "error"
    );
  }
}

  return (

    <>

      {/* MOBILE HEADER */}

      <header className="mobile-header">

        <button
          className="mobile-menu-btn"
          onClick={() =>
            setMenuOpen(true)
          }
        >

          <Menu size={24} />

        </button>

        <img
          src={logo}
          alt="Somar"
          className="mobile-logo"
        />

      </header>

      {/* OVERLAY */}

      {menuOpen && (

        <div
          className="sidebar-overlay"
          onClick={() =>
            setMenuOpen(false)
          }
        />

      )}

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          menuOpen
            ? "sidebar-open"
            : ""
        }`}
      >

        <div>

          {/* MOBILE CLOSE */}

          <div className="sidebar-mobile-top">

  <div className="sidebar-logo">

    <div className="sidebar-logo-icon">
      S
    </div>

    <div>

      <strong>
        Somar
      </strong>

      <span>
        Admin Panel
      </span>

    </div>

  </div>

  <button
    className="sidebar-close-btn"
    onClick={() =>
      setMenuOpen(false)
    }
  >

    <X size={22} />

  </button>

</div>

          {/* LOGO DESKTOP */}

          <div className="sidebar-logo">

            <div className="sidebar-logo-icon">
              S
            </div>

            <div>

              <strong>
                Somar
              </strong>

              <span>
                Admin Panel
              </span>

            </div>

          </div>

          {/* NAV */}

          <nav className="sidebar-nav">

            <Link
              to="/dashboard"
              className={
                location.pathname === "/dashboard"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMenuOpen(false)
              }
            >

              <LayoutDashboard size={20} />

              Dashboard

            </Link>

            <Link
              to="/vaquinhas"
              className={
                location.pathname.includes("/vaquinhas")
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMenuOpen(false)
              }
            >

              <HandHeart size={20} />

              Vaquinhas

            </Link>

            <Link
              to="/usuarios"
              className={
                location.pathname === "/usuarios"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMenuOpen(false)
              }
            >

              <Users size={20} />

              Usuários

            </Link>

            <Link
              to="/doacoes"
              className={
                location.pathname === "/doacoes"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMenuOpen(false)
              }
            >

              <Wallet size={20} />

              Doações

            </Link>

            <Link
  to="/assinantes"
  className={
    location.pathname === "/assinantes"
      ? "active"
      : ""
  }
  onClick={() =>
    setMenuOpen(false)
  }
>

  <Repeat size={20} />

  Assinantes

</Link>

            <Link
              to="/configuracoes"
              className={
                location.pathname === "/configuracoes"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMenuOpen(false)
              }
            >

              <Settings size={20} />

              Configurações

            </Link>

          </nav>

        </div>

        {/* LOGOUT */}

       <button
  className="sidebar-logout"
  onClick={handleLogout}
>

  <LogOut size={20} />

  Sair da conta

</button>

      </aside>

    </>

  );
}
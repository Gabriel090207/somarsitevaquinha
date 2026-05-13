import "./Header.css";
import { useState } from "react";

import logo from "../../assets/logo/logo.png";

import {
  Search,
  User,
  ChevronRight,
  Menu,
  X,
  Home,
  HeartHandshake,
  Info,
  CircleHelp,
} from "lucide-react";


import { NavLink } from "react-router-dom";

export function Header() {

  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="top-header">

        <div className="top-header-content">

          <div className="top-icon">
            <ChevronRight size={26} />
            <ChevronRight size={26} />
            <ChevronRight size={26} />
          </div>

          <p>
            Transforme vidas o ano todo.
          </p>

          <button>
            Seja um doador mensal
          </button>

        </div>

      </div>

      <header className="header">
        <div className="header-container">

          <div className="header-logo">
            <img src={logo} alt="Somar" />
          </div>

         <nav className="header-nav">
  <NavLink to="/">
    Início
  </NavLink>

  <NavLink to="/vaquinhas">
    Vaquinhas
  </NavLink>

  <NavLink to="/sobre">
    Sobre Nós
  </NavLink>

  <NavLink to="/duvidas">
    Dúvidas?
  </NavLink>
</nav>

         <div className="mobile-actions">

  <button className="search-button">
    <Search size={20} />
  </button>

  <button
    className="mobile-menu-button"
    onClick={() => setMenuOpen(true)}
  >
    <Menu size={28} />
  </button>

</div>

          <div className="header-actions">

            <button className="search-button">
              <Search size={20} />
            </button>


            <button className="login-button">
              Entrar
              <User size={20} />
            </button>

          </div>
        </div>
      </header>


      <div
  className={`mobile-overlay ${menuOpen ? "active" : ""}`}
  onClick={() => setMenuOpen(false)}
/>

<div className={`mobile-sidebar ${menuOpen ? "active" : ""}`}>

 <div className="mobile-sidebar-header">

  <div className="mobile-user">

    <div className="mobile-user-icon">
      <User size={38} />
    </div>

    <div className="mobile-user-text">

      <span>
        Olá, Visitante
      </span>

      <small>
        Bem-vindo à Somar
      </small>

    </div>

  </div>

  <button onClick={() => setMenuOpen(false)}>
    <X size={24} />
  </button>

</div>




 <nav className="mobile-nav">
  <NavLink to="/" onClick={() => setMenuOpen(false)}>
    <Home size={20} />
    Início
  </NavLink>

  <NavLink to="/vaquinhas" onClick={() => setMenuOpen(false)}>
    <HeartHandshake size={20} />
    Vaquinhas
  </NavLink>

  <NavLink to="/sobre" onClick={() => setMenuOpen(false)}>
    <Info size={20} />
    Sobre Nós
  </NavLink>

  <NavLink to="/duvidas" onClick={() => setMenuOpen(false)}>
    <CircleHelp size={20} />
    Dúvidas
  </NavLink>
</nav>


  <div className="mobile-sidebar-footer">

  <button className="mobile-login-button">

  Entrar

  <User size={25} />

</button>

  </div>

</div>

    </>
  );
}
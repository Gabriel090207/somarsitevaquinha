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
  ChevronDown,
  LogOut,
  Wallet,
  Heart,
  Settings,
  
  
} from "lucide-react";


import { NavLink } from "react-router-dom";

import {
  useAuth,
} from "../../contexts/AuthContext";

import {
  signOut,
} from "firebase/auth";

import {
  auth,
} from "../../services/firebase";


import {
  useToast,
} from "../../contexts/ToastContext";

export function Header() {

const {
  user,
  userData,
} = useAuth();

const { showToast } =
  useToast();

const [menuOpen, setMenuOpen] = useState(false);

const [accountMenuOpen,
  setAccountMenuOpen] =
    useState(false);


const [closingMenu,
  setClosingMenu] =
    useState(false);


function toggleAccountMenu() {

  if (accountMenuOpen) {

    setClosingMenu(true);

    setTimeout(() => {

      setAccountMenuOpen(false);

      setClosingMenu(false);

    }, 220);

  } else {

    setAccountMenuOpen(true);
  }
}

async function handleLogout() {

  await signOut(auth);

  showToast(
    "Sessão encerrada com sucesso."
  );

  setAccountMenuOpen(false);
}

  
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


          {

  user ? (

   <div className="account-wrapper">

  <button
    className="account-button"
    onClick={toggleAccountMenu}
  >

    <ChevronDown
      size={18}
      className={
        accountMenuOpen
          ? "rotate"
          : ""
      }
    />

    Minha conta

    <User size={20} />

  </button>

  {

    accountMenuOpen && (

      <div
  className={`account-dropdown ${
    closingMenu
      ? "closing"
      : ""
  }`}
>

       <NavLink
  to="/perfil"
  onClick={() =>
    setAccountMenuOpen(false)
  }
>

  <User size={20} />

  Meu perfil

</NavLink>

<NavLink
  to="/minhas-doacoes"
  onClick={() =>
    setAccountMenuOpen(false)
  }
>

  <Heart size={20} />

  Minhas doações

</NavLink>


        <button>

          <Wallet size={20} />

          Minha carteira

        </button>

        <button>

          <Settings size={20} />

          Configurações

        </button>

        <div className="dropdown-divider" />

        <button
          onClick={handleLogout}
          className="logout-button"
        >

          <LogOut size={20} />

          Sair

        </button>

      </div>

    )

  }

</div>

  ) : (

    <NavLink
      to="/login"
      className="login-button"
    >

      Entrar

      <User size={20} />

    </NavLink>

  )

}

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

    {

      

  user
    ? `Olá, ${
        user.displayName ||
        userData?.name.split(" ")[0]
      }`
    : "Olá, Visitante"

}

  </span>

  <small>

    {

      user
        ? "Sua conta está conectada"
        : "Bem-vindo à Somar"

    }

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

{

  user && (

    <>

      <div className="mobile-divider" />

      <div className="mobile-account-section">

       <NavLink
  to="/perfil"
  onClick={() =>
    setMenuOpen(false)
  }
>

  <User size={20} />

  Meu perfil

</NavLink>

<NavLink
  to="/minhas-doacoes"
  onClick={() =>
    setMenuOpen(false)
  }
>

  <HeartHandshake size={20} />

  Minhas doações

</NavLink>

        <button>

    <Wallet size={22} />

    Minha carteira

  </button>

        <button>

          <Settings size={22} />

          Configurações

        </button>

      </div>

    </>

  )

}

  <div className="mobile-sidebar-footer">

{

  user ? (

    <button
      className="mobile-logout-button"
      onClick={handleLogout}
    >

      <LogOut size={24} />

      Sair da conta

    </button>

  ) : (

    <NavLink
      to="/login"
      className="mobile-login-button"
      onClick={() =>
        setMenuOpen(false)
      }
    >

      Entrar

      <User size={25} />

    </NavLink>

  )

}

</div>

</div>

    </>
  );
}
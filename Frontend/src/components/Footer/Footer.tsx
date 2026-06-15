import "./Footer.css";

import logo from "../../assets/logo/logo.png";

import {
  FiInstagram,
  FiFacebook,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import { Link }
  from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-container">

          <div className="footer-brand">

            <img
              src={logo}
              alt="Logo da Somar"
            />

        

            <strong>
              Plataforma solidária brasileira
            </strong>

            <small className="footer-cnpj">
  CNPJ: 65.703.333/0001-22
</small>

        

          </div>

          <div className="footer-column">

            <h4>
              Nosso endereço
            </h4>

            <p>
              Avenida Prefeito João Nunes de Menezes, Número 119
            </p>

            <p>
              Bairro Centro • Município Tiangua - CE
            </p>

            <p>
              CEP: 62.327-390
            </p>

          </div>

          <div className="footer-column">

            <h4>
              Nossas redes
            </h4>

            <div className="footer-socials">

              <a href="https://www.instagram.com/p/DYN7NWGOYGK/?igsh=a2Rpc29tMGdzZTd1"
              target="_blank"
              rel="noopener noreferrer">
              
                <FiInstagram size={22} />
              </a>

              <a href="https://www.facebook.com/people/Vaquinha-Somar/61590016323603/?ref=PROFILE_EDIT_xav_ig_profile_page_web#"
                target="_blank"
              rel="noopener noreferrer">
                <FiFacebook size={22} />
              </a>

            <a
  href="https://wa.me/5586921427920"
  target="_blank"
  rel="noopener noreferrer"
>
  <FaWhatsapp size={22} />
</a>

            </div>

          </div>

        </div>

      </div>

      <div className="footer-bottom">

        <div className="footer-container footer-bottom-content">

          <span>
            © 2026 Somar
          </span>

          <div className="footer-links">

           <Link
  to="/duvidas?tab=taxas"
>
  Taxas
</Link>

            <Link to="/termos-de-uso">
  Termos de uso
</Link>

            <Link to="/politica-de-privacidade">
  Política de Privacidade
</Link>

           

            <Link to="/contato">
  Contato
</Link>

          </div>

        </div>

      </div>

    </footer>
  );
}
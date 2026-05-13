import "./Footer.css";

import logo from "../../assets/logo/logo.png";

import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
} from "react-icons/fi";

export function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-container">

          <div className="footer-brand">

            <img
              src={logo}
              alt="Somar"
            />

        

            <strong>
              Plataforma solidária brasileira
            </strong>

          </div>

          <div className="footer-column">

            <h4>
              Nosso endereço
            </h4>

            <p>
              Avenida Solidária, 123
            </p>

            <p>
              Centro • São Paulo/SP
            </p>

            <p>
              CEP 00000-000
            </p>

          </div>

          <div className="footer-column">

            <h4>
              Nossas redes
            </h4>

            <div className="footer-socials">

              <a href="#">
                <FiInstagram size={22} />
              </a>

              <a href="#">
                <FiFacebook size={22} />
              </a>

              <a href="#">
                <FiTwitter size={22} />
              </a>

              <a href="#">
                <FiLinkedin size={22} />
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

            <a href="#">
              Taxas
            </a>

            <a href="#">
              Termos de uso
            </a>

            <a href="#">
              Política de Privacidade
            </a>

            <a href="#">
              Cookies
            </a>

            <a href="#">
              Contato
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}
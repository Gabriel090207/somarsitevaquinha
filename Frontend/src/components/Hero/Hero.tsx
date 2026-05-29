import "./Hero.css";

import mascot from "../../assets/mascot/cow.png";
import heroBg from "../../assets/images/hero-bg.jpg";

import {
  ShieldCheck,
  BadgeCheck,
  Lock,
} from "lucide-react";

import { Link }
  from "react-router-dom";

export function Hero() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    >
      <div className="hero-overlay"></div>

      <div className="hero-container">

        <div className="hero-left">
          <img src={mascot} alt="Mascote" />
        </div>

        <div className="hero-content">

          <span className="hero-badge">
            O melhor site de vaquinhas do Brasil
          </span>

          <h1>
            Histórias reais.
            <br />
            <span>Impacto verdadeiro.</span>
          </h1>

          <p>
            A única plataforma de vaquinhas do país com
            100% das histórias verificadas.
          </p>

          <small>
            Aqui não tem história fake!
          </small>

          <Link
  to="/sobre"
  className="hero-button"
>

  Conheça nossa história

</Link>

        </div>

      </div>

      <div className="hero-cards">

        <div className="hero-card">
          <ShieldCheck size={22} />

          <div>
            <strong>Histórias verificadas</strong>
            <span>Segurança total</span>
          </div>
        </div>

        <div className="hero-card">
          <BadgeCheck size={22} />

          <div>
            <strong>Milhares de vidas impactadas</strong>
            <span>Todos os meses</span>
          </div>
        </div>

        <div className="hero-card">
          <Lock size={22} />

          <div>
            <strong>Pagamento seguro</strong>
            <span>Criptografia protegida</span>
          </div>
        </div>

      </div>
    </section>
  );
}
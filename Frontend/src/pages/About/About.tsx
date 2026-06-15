import "./About.css";

import aboutImage from "../../assets/images/questions-bg.png";

import {
  ShieldCheck,
  HeartHandshake,
  Megaphone,
  BadgeDollarSign,
} from "lucide-react";

export function About() {
  return (
    <section className="about-page">

      {/* HERO */}

      <section
        className="about-hero"
        style={{
          backgroundImage: `url(${aboutImage})`,
        }}
      >

        <div className="about-hero-overlay" />

        <div className="about-hero-content">

          <span>
            Sobre a Somar
          </span>

          <h1>
            Queremos mudar
            <br />
            o final das histórias
          </h1>

          <p>
            Transparência, impacto real e solidariedade.
          </p>

        </div>

      </section>

      {/* INTRO */}

      <section className="about-intro">

        <div className="about-intro-logo">
          s
        </div>

        <div className="about-intro-content">

          <p>
            A <strong>Somar</strong> nasceu para transformar histórias
            reais em campanhas capazes de mobilizar milhares de pessoas.
          </p>

          <p>
            Nossa missão é conectar quem precisa de ajuda
            com pessoas dispostas a fazer o bem,
            criando uma rede de solidariedade segura,
            transparente e humana.
          </p>

          <p>
            Cada campanha publicada passa por um processo
            de análise, validação e acompanhamento,
            garantindo mais confiança para quem doa.
          </p>

        </div>

      </section>

      {/* COMO FUNCIONA */}

      <section
        className="about-work"
        style={{
          backgroundImage: `url(${aboutImage})`,
        }}
      >

        <div className="about-work-overlay" />

        <div className="about-work-content">

          <h2>
            Como funciona
            <br />
            nosso trabalho
          </h2>

        </div>

      </section>

      {/* STEPS */}

      <section className="about-steps">

        <p className="about-steps-text">
          Diferente de plataformas abertas,
          nossa equipe acompanha todas as campanhas
          para garantir segurança, verdade e impacto real.
        </p>

        <div className="about-steps-grid">

          <div className="about-step">

            <div className="about-step-icon">
              <HeartHandshake size={34} />
            </div>

            <span>
              1 - Recebimento da história
            </span>

          </div>

          <div className="about-step">

            <div className="about-step-icon">
              <ShieldCheck size={34} />
            </div>

            <span>
              2 - Curadoria e validação
            </span>

          </div>

          <div className="about-step">

            <div className="about-step-icon">
              <BadgeDollarSign size={34} />
            </div>

            <span>
              3 - Publicação da campanha
            </span>

          </div>

          <div className="about-step">

            <div className="about-step-icon">
              <Megaphone size={34} />
            </div>

            <span>
              4 - Divulgação e impacto
            </span>

          </div>

        </div>

      </section>

     

     {/* GRID */}

<section className="about-grid">

  {/* BLOCO 1 */}

  <div className="about-grid-image">

    <img
      src={aboutImage}
      alt=""
    />

  </div>

  <div className="about-grid-content primary">

    <h3>
      Verificação das histórias
    </h3>

    <p>
      Todas as campanhas passam por um processo
      rigoroso de validação para garantir segurança,
      transparência e credibilidade.
    </p>

    <h3>
      Segurança jurídica
    </h3>

    <p>
      Trabalhamos com contratos e acompanhamento
      completo para garantir que as arrecadações
      sejam utilizadas corretamente.
    </p>

  </div>

  {/* BLOCO 2 */}

  <div className="about-grid-content white mobile-second-text">

    <h3>
      Comunicação humanizada
    </h3>

    <p>
      Nosso time produz conteúdo diariamente
      para ampliar o alcance das histórias
      e conectar pessoas através da empatia.
    </p>

    <strong>
      Nosso objetivo é amplificar histórias reais.
    </strong>

  </div>

  <div className="about-grid-image mobile-second-image">

    <img
      src={aboutImage}
      alt=""
    />

  </div>

</section>

    </section>
  );
}
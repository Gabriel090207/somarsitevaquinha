import "./Contact.css";

import termsBg
  from "../../assets/images/questions-bg.png";

export function Contact() {

  return (

    <section className="contact-page">

      <div
        className="contact-hero"
        style={{
          backgroundImage:
            `url(${termsBg})`,
        }}
      >

        <div className="contact-overlay" />

        <div className="contact-hero-content">

          <span className="contact-badge">
            Estamos aqui para ajudar
          </span>

          <h1>

            Entre em

            <span> contato</span>

          </h1>

          <p>
            Fale conosco através dos nossos
            canais oficiais.
          </p>

        </div>

      </div>

      <div className="contact-container">

        <div className="contact-section">

          <h2>
            E-mail
          </h2>

          <p>
            Para dúvidas, sugestões ou suporte,
            entre em contato através do nosso
            e-mail oficial.
          </p>

          <a
            href="mailto:Somardoacoes@gmail.com"
          >
            Somardoacoes@gmail.com
          </a>

        </div>

        <div className="contact-section">

          <h2>
            WhatsApp
          </h2>

          <p>
            Converse diretamente com nossa equipe.
          </p>

          <a
            href="https://wa.me/5586921427920"
            target="_blank"
            rel="noopener noreferrer"
          >
            (86) 92142-7920
          </a>

        </div>

        <div className="contact-section">

          <h2>
            Instagram
          </h2>

          <p>
            Acompanhe campanhas, histórias e
            novidades da Somar.
          </p>

          <a
            href="https://www.instagram.com/ajudesomar/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @ajudesomar
          </a>

        </div>

        <div className="contact-section">

          <h2>
            YouTube
          </h2>

          <p>
            Conheça histórias e acompanhe o
            crescimento da comunidade Somar.
          </p>

          <a
            href="https://www.youtube.com/@ajudeasomar"
            target="_blank"
            rel="noopener noreferrer"
          >
            Canal Ajude a Somar
          </a>

        </div>

      </div>

    </section>

  );

}
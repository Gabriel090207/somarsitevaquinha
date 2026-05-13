import "./Questions.css";

import { useState } from "react";

import {
  ChevronDown,
  PlayCircle,
} from "lucide-react";

const faq = [
  {
    question: "Qual a taxa da Somar?",
    answer:
      "A Somar trabalha com uma taxa administrativa para manter a plataforma segura, transparente e sustentável.",
  },

  {
    question: "Como funciona o recebimento das doações?",
    answer:
      "Após validação da campanha, os valores são destinados diretamente ao beneficiário.",
  },

  {
    question: "Posso criar uma campanha?",
    answer:
      "Sim. Nossa equipe avalia todas as histórias antes da publicação.",
  },

  {
    question: "As campanhas são verificadas?",
    answer:
      "Sim. Todas passam por processo de análise e validação.",
  },
];

export function Questions() {

  const [tab, setTab] = useState("faq");

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="questions-page">

      {/* HERO */}

      <div className="questions-hero">

        <div className="questions-overlay" />

        <div className="questions-hero-content">

          <span className="questions-badge">
            Central de ajuda Somar
          </span>

          <h1>
            Tire suas dúvidas
            <br />
            sobre a <span>Somar</span>
          </h1>

          <p>
            Transparência, segurança e impacto real.
          </p>

        </div>

      </div>

      {/* CONTENT */}

      <div className="questions-container">

        {/* TABS */}

        <div className="questions-tabs">

          <button
            className={tab === "taxas" ? "active" : ""}
            onClick={() => setTab("taxas")}
          >
            Taxas
          </button>

          <button
            className={tab === "pix" ? "active" : ""}
            onClick={() => setTab("pix")}
          >
            Como doar via Pix
          </button>

          <button
            className={tab === "faq" ? "active" : ""}
            onClick={() => setTab("faq")}
          >
            FAQ
          </button>

        </div>

        {/* TAXAS */}

        {tab === "taxas" && (

          <div className="questions-content">

            <h2>
              Transparência total
            </h2>

            <p>
              A Somar acredita em campanhas reais e impacto verdadeiro.
              Nossa taxa ajuda a manter toda estrutura da plataforma,
              validação das histórias e segurança das doações.
            </p>

            <p>
              Diferente de plataformas abertas, nossa equipe acompanha
              cada campanha para garantir confiança e transparência.
            </p>

            <div className="questions-highlight">

              <strong>
                100% das histórias verificadas
              </strong>

              <span>
                Segurança para quem doa e para quem recebe.
              </span>

            </div>

          </div>
        )}

        {/* PIX */}

        {tab === "pix" && (

          <div className="questions-video">

            <h2>
              Como doar via PIX?
            </h2>

            <div className="video-card">

              <PlayCircle size={70} />

            </div>

          </div>
        )}

        {/* FAQ */}

        {tab === "faq" && (

          <div className="faq-wrapper">

            <div className="faq-header">

              <h2>
                FAQ
              </h2>

              <p>
                Tem dúvidas? Estamos aqui para ajudar.
              </p>

            </div>

            <div className="faq-list">

              {faq.map((item, index) => (

                <div
                  className={`faq-item ${
                    openFaq === index ? "open" : ""
                  }`}
                  key={index}
                >

                  <button
                    className="faq-question"
                    onClick={() =>
                      setOpenFaq(
                        openFaq === index ? null : index
                      )
                    }
                  >

                    {item.question}

                    <ChevronDown size={20} />

                  </button>

                  <div className="faq-answer">

  <div>

    <p>
      {item.answer}
    </p>

  </div>

</div>

                </div>
              ))}

            </div>

          </div>
        )}

      </div>

    </section>
  );
}
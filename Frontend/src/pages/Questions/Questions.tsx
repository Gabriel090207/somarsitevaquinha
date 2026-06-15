import "./Questions.css";

import { useState } from "react";

import {
  ChevronDown,
  PlayCircle,
} from "lucide-react";

import {
  useSearchParams,
} from "react-router-dom";

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

  const [searchParams] =
  useSearchParams();

const [tab, setTab] =
  useState<
    "faq" |
    "taxas" |
    "pix"
  >(
    (
      searchParams.get("tab") as
        | "faq"
        | "taxas"
        | "pix"
    ) || "faq"
  );
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
      Somos uma plataforma 100% transparente e
      ficamos felizes pelo seu interesse em
      entender como tudo funciona por aqui.
    </p>

    <p>
      A Somar é uma empresa com propósito
      social. Não somos uma ONG. Somos uma
      equipe formada por pessoas que acreditam
      no poder da solidariedade para transformar
      histórias reais. Para continuarmos
      conectando quem precisa de ajuda a quem
      deseja ajudar, precisamos manter uma
      estrutura profissional, segura e
      sustentável.
    </p>

    <p>
      Por isso, trabalhamos com uma taxa
      administrativa de 20% sobre o valor
      arrecadado. Essa taxa é utilizada para
      manter toda a operação da plataforma
      funcionando com qualidade,
      responsabilidade e transparência.
    </p>

    <p>
      Diferente de plataformas abertas, a Somar
      realiza uma análise cuidadosa das campanhas
      antes da publicação. Nosso objetivo é
      garantir mais segurança para os doadores,
      verificar informações, acompanhar os
      beneficiários e oferecer uma experiência
      confiável para todos os envolvidos.
    </p>

    <p>
      Além disso, investimos continuamente em
      tecnologia, segurança, atendimento,
      marketing e melhorias na plataforma para
      ampliar o alcance das campanhas e aumentar
      as chances de arrecadação.
    </p>

    <p>
      Em muitas plataformas existem cobranças
      adicionais, taxas operacionais ou custos
      relacionados aos meios de pagamento que
      nem sempre são comunicados de forma clara.
      Na Somar, nossa política é simples: a taxa
      administrativa é de 20%, sem surpresas ou
      cobranças ocultas.
    </p>

    <p>
      Sabemos que existem plataformas com taxas
      menores, mas acreditamos que confiança,
      segurança, acompanhamento e transparência
      fazem toda a diferença para quem doa e
      para quem recebe ajuda.
    </p>

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
import "./Campaign.css";

import {
  useEffect,
  useState,
} from "react";

import {
  Bookmark,
  Calendar,
  CheckCircle,
  HeartHandshake,
  Lightbulb,
  MessageCircle,
  Share2,
  Tag,
  User,
  Users,
} from "lucide-react";

import campaignImage from "../../assets/images/campanha.png";

export function Campaign() {

  const [
    activeTab,
    setActiveTab,
  ] = useState("history");

  const collected = 9275.8;

  const goal = 120000;

  const percentage =
    Math.round(
      (collected / goal) * 100
    );

const [
  sidebarStopped,
  setSidebarStopped,
] = useState(false);

useEffect(() => {

  function handleScroll() {

    if (window.innerWidth <= 980) {
      setSidebarStopped(false);
      return;
    }

    const footer =
      document.querySelector("footer");

    if (!footer) return;

    const footerTop =
      footer.getBoundingClientRect().top;

    setSidebarStopped(
      footerTop <= 720
    );
  }

  window.addEventListener(
    "scroll",
    handleScroll
  );

  window.addEventListener(
    "resize",
    handleScroll
  );

  handleScroll();

  return () => {

    window.removeEventListener(
      "scroll",
      handleScroll
    );

    window.removeEventListener(
      "resize",
      handleScroll
    );

  };

}, []);

  return (

    <main className="campaign-page">

      <section className="campaign-container">

        <div className="campaign-layout campaign-layout-limit">

          <div className="campaign-main">

            <div className="campaign-title-area">

              <span>
                Saúde
              </span>

              <h1>
                Pais pedem ajuda para filho que precisa de tratamento urgente
              </h1>

              <p>
                Ajude essa família a garantir mais dignidade,
                cuidado e esperança.
              </p>

            </div>

            <div className="campaign-gallery">

              <button className="campaign-follow-floating">

                <Bookmark size={18} />

                Seguir

              </button>

              <img
                src={campaignImage}
                alt="Campanha"
              />

            </div>

            <div className="campaign-tabs">

              <button
                className={
                  activeTab === "history"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("history")
                }
              >

                <HeartHandshake size={20} />

                História

              </button>

              <button
                className={
                  activeTab === "updates"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("updates")
                }
              >

                <Lightbulb size={20} />

                Novidades

                <strong>
                  0
                </strong>

              </button>

              <button
                className={
                  activeTab === "donors"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("donors")
                }
              >

                <Users size={20} />

                Doadores

                <strong>
                  270
                </strong>

              </button>

              <button
                className={
                  activeTab === "messages"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("messages")
                }
              >

                <MessageCircle size={20} />

                Mensagens

                <strong>
                  1
                </strong>

              </button>

            </div>

            {

              activeTab === "history" && (

                <div className="campaign-story">

                  <div className="campaign-verification">

                    <span>
                      <CheckCircle size={18} />
                      Vaquinha verificada
                    </span>

                    <span>
                      <CheckCircle size={18} />
                      Documentos checados
                    </span>

                  </div>

                  <p>
                    Esta campanha foi criada para ajudar uma família
                    que enfrenta um momento difícil e precisa de apoio
                    para continuar um tratamento essencial.
                  </p>

                  <p>
                    Os custos mensais são altos e envolvem consultas,
                    medicamentos, transporte, alimentação e cuidados
                    contínuos. Cada contribuição ajuda a manter esse
                    cuidado vivo.
                  </p>

                  <h3>
                    Entenda
                  </h3>

                  <p>
                    Desde o início do tratamento, a rotina da família
                    mudou completamente. O que antes parecia simples,
                    hoje exige força, dedicação e muitos recursos.
                  </p>

                  <p>
                    Com a sua ajuda, será possível garantir mais meses
                    de acompanhamento, conforto e esperança.
                  </p>

                </div>

              )

            }

            {

              activeTab === "updates" && (

                <div className="campaign-empty">

                  <h3>
                    Novidades
                  </h3>

                  <p>
                    Por enquanto não temos novidades.
                    Fique de olho, manteremos você sempre atualizado.
                  </p>

                </div>

              )

            }

            {

              activeTab === "donors" && (

                <div className="campaign-donors">

                  <h3>
                    Doadores

                    <span>
                      270
                    </span>

                  </h3>

                  <div className="donor-item">

                    <div>
                      <User size={22} />
                    </div>

                    <section>
                      <strong>
                        Gabriel Borela
                      </strong>

                      <p>
                        R$ 25,00 · há 15 minutos
                      </p>
                    </section>

                  </div>

                  <div className="donor-item">

                    <div>
                      <User size={22} />
                    </div>

                    <section>
                      <strong>
                        Maria Souza
                      </strong>

                      <p>
                        R$ 50,00 · há 2 horas
                      </p>
                    </section>

                  </div>

                  <button className="campaign-see-more">
                    Ver mais
                  </button>

                </div>

              )

            }

            {

              activeTab === "messages" && (

                <div className="campaign-messages">

                  <h3>
                    Mensagens

                    <span>
                      1
                    </span>

                  </h3>

                  <div className="message-item">

                    <div>
                      <User size={22} />
                    </div>

                    <section>

                      <strong>
                        Danielle Leite
                      </strong>

                      <small>
                        há 3 dias
                      </small>

                      <p>
                        Que Deus abençoe e que tudo dê certo.
                        Estou em oração por vocês.
                      </p>

                    </section>

                  </div>

                </div>

              )

            }

            <div className="campaign-related-info">

              <div className="campaign-tags">

                <span>
                  Doença rara
                </span>

                <span>
                  Tratamento
                </span>

                <span>
                  Saúde
                </span>

              </div>

              <div className="campaign-meta">

                <span>
                  <Calendar size={18} />
                  Criado em 14 de maio de 2026
                </span>

                <span>
                  <Tag size={18} />
                  Saúde
                </span>

              </div>

            </div>

          </div>

          <aside
  className={`campaign-sidebar ${
    sidebarStopped ? "stopped" : ""
  }`}
>

            <div className="campaign-donation-card">

              <span>
                Arrecadado
              </span>

              <h2>
                R$ 9.275,80
              </h2>

              <p>
                De R$ 120.000,00
              </p>

              <div className="campaign-progress">

                <div
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>

              <div className="campaign-progress-info">

                <span>
                  27 dias restantes
                </span>

                <span>
                  {percentage}%
                </span>

              </div>

              <button>
                Quero Doar
              </button>

            </div>

            <button className="campaign-share-button">

              <Share2 size={18} />

              Compartilhar vaquinha

            </button>

            <button className="campaign-follow-button">

              <Bookmark size={18} />

              Seguir vaquinha para saber das novidades

            </button>

          </aside>

        </div>

      </section>

    </main>

  );
}
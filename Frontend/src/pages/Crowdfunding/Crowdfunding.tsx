import "./Crowdfunding.css";
import { useState } from "react";


import campaignImage from "../../assets/images/campanha.png";

import {
  Search,
  ChevronDown,
  ChevronUp,
  Bookmark,
  SlidersHorizontal,
  HeartHandshake,
  GraduationCap,
  TriangleAlert,
  HandHeart,
  Trophy,
  BriefcaseBusiness,
  House,
  HeartPulse,
  Repeat,
} from "lucide-react";

const campaigns = [
  {
    category: "SAÚDE",
    title:
      "Vaquinha para Ana, que pode perder os dedos e os pulmões aos...",
    value: "R$ 722,00",
    goal: "Meta de R$ 38.000,00",
    progress: 8,
    remaining: "33 dias restantes",
  },

  {
    category: "MORADIA",
    title:
      "Mulher tem a casa incendiada pelo ex e dorme num barraco sem banheiro...",
    value: "R$ 8.439,81",
    goal: "Meta de R$ 120.000,00",
    progress: 5,
    remaining: "33 dias restantes",
  },

  {
    category: "EMERGENCIAIS",
    title:
      "Vaquinha para mulher que sobreviveu a mais de 10 marteladas...",
    value: "R$ 48.914,22",
    goal: "Meta de R$ 70.000,00",
    progress: 70,
    remaining: "26 dias restantes",
  },

  {
    category: "EDUCAÇÃO",
    title:
      "Ajude jovens estudantes a continuarem seus estudos em segurança...",
    value: "R$ 12.440,00",
    goal: "Meta de R$ 22.000,00",
    progress: 52,
    remaining: "18 dias restantes",
  },

  {
    category: "PROJETOS",
    title:
      "Projeto social para alimentação de famílias em vulnerabilidade...",
    value: "R$ 4.220,00",
    goal: "Meta de R$ 10.000,00",
    progress: 42,
    remaining: "41 dias restantes",
  },

  {
    category: "SAÚDE",
    title:
      "Ajude no tratamento urgente de uma criança em estado delicado...",
    value: "R$ 18.540,00",
    goal: "Meta de R$ 30.000,00",
    progress: 61,
    remaining: "12 dias restantes",
  },
];

export function Crowdfunding() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <section className="crowdfunding-page">

      <div className="crowdfunding-container">

        <div className="crowdfunding-header">

          <span>
            Explore campanhas reais
          </span>

          <h1>
            Encontre vaquinhas que precisam da sua ajuda
          </h1>

          <p>
            Descubra histórias verificadas e transforme vidas através da Somar.
          </p>

        </div>

        <div className="crowdfunding-topbar">

          <div className="crowdfunding-search">

            <Search size={20} />

            <input
              type="text"
              placeholder="Busque campanhas, causas ou pessoas..."
            />

          </div>

          <div className="crowdfunding-actions">

            <button className="filter-button">
              <SlidersHorizontal size={18} />
              Filtros
            </button>

            <button className="dropdown-button">
              Categorias
              <ChevronDown size={18} />
            </button>

            <button className="dropdown-button">
              Mais recentes
              <ChevronDown size={18} />
            </button>

          </div>

        </div>

        <div className="crowdfunding-content">

          <aside className="crowdfunding-sidebar">

          <div className="sidebar-block">

  <strong
    className="sidebar-title"
    onClick={() => {
      if (window.innerWidth <= 980) {
        setSidebarOpen(!sidebarOpen);
      }
    }}
  >

    Categorias

    {sidebarOpen ? (
      <ChevronUp size={18} />
    ) : (
      <ChevronDown size={18} />
    )}

  </strong>

  <div
    className={`sidebar-categories ${
      sidebarOpen ? "open" : "closed"
    }`}
  >

    <button className="active">
      <HeartHandshake size={16} />
      Todos
    </button>

    <button>
      <GraduationCap size={16} />
      Educação
    </button>

    <button>
      <TriangleAlert size={16} />
      Emergenciais
    </button>

    <button>
      <HandHeart size={16} />
      Empatia
    </button>

    <button>
      <Trophy size={16} />
      Esporte
    </button>

    <button>
      <BriefcaseBusiness size={16} />
      Geração de renda
    </button>

    <button>
      <House size={16} />
      Moradia
    </button>

    <button>
      <HeartHandshake size={16} />
      Projetos sociais
    </button>

    <button>
      <Repeat size={16} />
      Recorrente
    </button>

    <button>
      <HeartPulse size={16} />
      Saúde
    </button>

  </div>

</div>

          </aside>

          <div className="crowdfunding-grid">

            {campaigns.map((campaign) => (
              <div className="campaign-card">

                <div className="campaign-image">

                  <img
                    src={campaignImage}
                    alt=""
                  />

                  <button className="save-button">
                    <Bookmark size={14} />
                  </button>

                </div>

                <div className="campaign-content-card">

                  <span className="campaign-category">
                    {campaign.category}
                  </span>

                  <h3>
                    {campaign.title}
                  </h3>

                  <div className="campaign-progress-info">

                    <small>
                      {campaign.remaining}
                    </small>

                    <small>
                      {campaign.progress}%
                    </small>

                  </div>

                  <div className="campaign-progress">
                    <div
                      style={{
                        width: `${campaign.progress}%`,
                      }}
                    />
                  </div>

                  <strong>
                    {campaign.value}
                  </strong>

                  <span className="campaign-goal">
                    {campaign.goal}
                  </span>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
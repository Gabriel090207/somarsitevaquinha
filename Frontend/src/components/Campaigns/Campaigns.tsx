import "./Campaigns.css";

import { useState } from "react";

import campaignImage from "../../assets/images/campanha.png";

import {
  HeartHandshake,
  GraduationCap,
  TriangleAlert,
  HandHeart,
  Trophy,
  BriefcaseBusiness,
  House,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  HeartPulse,
  Repeat,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const campaigns = [
  {
    id:1,
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
      "Vaquinha para mulher que sobreviveu a mais de 10 martelad...",
    value: "R$ 48.914,22",
    goal: "Meta de R$ 70.000,00",
    progress: 70,
    remaining: "26 dias restantes",
  },
];

export function Campaigns() {


const navigate = useNavigate();


const [slide, setSlide] = useState(0);

const maxSlide =
  window.innerWidth <= 980 ? 4 : 1;

const handleNext = () => {
  if (slide < maxSlide) {
    setSlide((prev) => prev + 1);
  }
};

const handlePrev = () => {
  if (slide > 0) {
    setSlide((prev) => prev - 1);
  }
};

  return (
    <section className="campaigns">

      <div className="campaigns-container">

        <div className="filters-wrapper">


{slide > 0 && (
  <>
    <div className="filters-shadow-left" />

    <button
      className="filters-arrow left"
      onClick={handlePrev}
    >
      <ChevronLeft size={22} />
    </button>
  </>
)}

          <div className="filters-container">

           <div
  className="campaigns-filters"
  style={{
  transform:
    window.innerWidth <= 980
      ? `translateX(-${slide * 240}px)`
      : slide > 0
      ? `translateX(-430px)`
      : `translateX(0px)`
}}
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

         {slide < maxSlide && (
  <>
    <div className="filters-shadow" />

    <button
      className="filters-arrow right"
      onClick={handleNext}
    >
      <ChevronRight size={22} />
    </button>
  </>
)}

        </div>

        <div className="campaigns-grid">

          {campaigns.map((campaign) => (
           <div
  className="campaign-card"
  onClick={() =>
    navigate(`/vaquinha/${campaign.id}`)
  }
>

              <div className="campaign-image">

                <img
                  src={campaignImage}
                  alt=""
                />

                <button className="save-button">
                  <Bookmark size={14} />
                </button>

              

              </div>

              <div className="campaign-content">

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

    </section>
  );
}
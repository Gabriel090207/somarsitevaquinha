import "./Crowdfunding.css";
import {
  useState,
  useEffect,
} from "react";

import { useToast }
  from "../../contexts/ToastContext";

import {
  query,
  where,
} from "firebase/firestore";

import { db }
  from "../../services/firebase";

import {
  useNavigate,
} from "react-router-dom";

import {
  Search,
  ChevronDown,
  ChevronUp,
  Bookmark,
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

import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";

import {
  auth,
} from "../../services/firebase";


import {
  onAuthStateChanged,
} from "firebase/auth";

type Campaign = {
  id: string;

  slug: string;

  title: string;

  category: string;

  imageUrl: string;

  raisedAmount: string | number;

goalAmount: string | number;

  duration: string;

  story: string;

  createdAt: any;

  status: string;
};

export function Crowdfunding() {

const { showToast } =
  useToast();

const [campaigns, setCampaigns] =
  useState<Campaign[]>([]);

const [loading, setLoading] =
  useState(true);

const navigate =
  useNavigate();

const [sidebarOpen, setSidebarOpen] = useState(false);

const [searchTerm, setSearchTerm] =
  useState("");

const [campaignFilter, setCampaignFilter] =
  useState("Todas");

const [periodFilter, setPeriodFilter] =
  useState("all");

const [selectedCategory, setSelectedCategory] =
  useState("Todos");

const [savedCampaigns, setSavedCampaigns] =
  useState<string[]>([]);

function parseMoney(
  value?: string | number
) {

  if (!value) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  return (
    Number(
      value.replace(/[^\d]/g, "")
    ) / 100
  );
}

function formatMoney(
  value?: string | number
) {

  const amount =
    parseMoney(value);

  return amount.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );
}

function calculateProgress(
  raised: string | number,
  goal: string | number
) {

  const raisedValue =
    parseMoney(raised);

  const goalValue =
    parseMoney(goal);

  if (!goalValue) return 0;

  return Math.min(
    Math.round(
      (raisedValue / goalValue) * 100
    ),
    100
  );
}

function truncateStory(
  text: string
) {

  if (!text) return "";

  const words =
    text.split(" ");

  if (words.length <= 25) {
    return text;
  }

  return (
    words
      .slice(0, 25)
      .join(" ") + "..."
  );
}

function calculateRemainingDays(
  duration: string,
  createdAt: any
) {

  if (!duration) {
    return "Sem prazo";
  }

  const totalDays =
    Number(
      duration.replace(/\D/g, "")
    );

  if (!createdAt?.toDate) {
    return `${totalDays} dias restantes`;
  }

  const createdDate =
    createdAt.toDate();

  const now =
    new Date();

  const startDate =
    new Date(
      createdDate.getFullYear(),
      createdDate.getMonth(),
      createdDate.getDate()
    );

  const currentDate =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

  const diffTime =
    currentDate.getTime() -
    startDate.getTime();

  const passedDays =
    Math.floor(
      diffTime /
      (1000 * 60 * 60 * 24)
    );

  const remainingDays =
    totalDays - passedDays;

  if (remainingDays <= 0) {
    return "Encerrada";
  }

  return `${remainingDays} dias restantes`;
}


useEffect(() => {

  const campaignsRef =
    collection(db, "campaigns");

  const q =
    query(
      campaignsRef,
      where(
        "status",
        "==",
        "Publicada"
      )
    );

  const unsubscribe =
    onSnapshot(
      q,
      (snapshot) => {

        const campaignsData =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Campaign[];

        setCampaigns(campaignsData);

        setLoading(false);
      }
    );

  return () => unsubscribe();

}, []);

useEffect(() => {

  const unsubscribeAuth =
    onAuthStateChanged(
      auth,
      (user) => {

        if (!user) return;

        const savedRef =
          collection(
            db,
            "users",
            user.uid,
            "savedCampaigns"
          );

        const unsubscribeSaved =
          onSnapshot(
            savedRef,
            (snapshot) => {

              const savedIds =
                snapshot.docs.map(
                  (doc) => doc.id
                );

              console.log(
                "SALVOS:",
                savedIds
              );

              setSavedCampaigns(
                savedIds
              );

            }
          );

        return () =>
          unsubscribeSaved();
      }
    );

  return () =>
    unsubscribeAuth();

}, []);


async function handleSaveCampaign(
  campaignId: string
) {

  const user =
    auth.currentUser;

  if (!user) {

    showToast(
      "Faça login para salvar campanhas.",
      "error"
    );

    return;
  }

  const saveRef =
    doc(
      db,
      "users",
      user.uid,
      "savedCampaigns",
      campaignId
    );

  const isSaved =
    savedCampaigns.includes(
      campaignId
    );

  if (isSaved) {

    await deleteDoc(saveRef);

    showToast(
      "Campanha removida dos salvos.",
      "info"
    );

  } else {

    await setDoc(saveRef, {

      campaignId,

      createdAt:
        new Date(),

    });

    showToast(
      "Campanha salva com sucesso!",
      "success"
    );

  }
}

const filteredCampaigns =
  [...campaigns]
    .filter((campaign) => {

      const matchesSearch =
        campaign.title
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesCategory =
        selectedCategory ===
        "Todos"
          ? true
          : campaign.category ===
            selectedCategory;

      let matchesCampaignFilter =
        true;

      let matchesPeriod =
        true;

      const progress =
        calculateProgress(
          campaign.raisedAmount,
          campaign.goalAmount
        );

      const remainingText =
        calculateRemainingDays(
          campaign.duration,
          campaign.createdAt
        );

      if (
        campaignFilter ===
        "Abertas"
      ) {

        matchesCampaignFilter =
          remainingText !==
          "Encerrada";
      }

      if (
        campaignFilter ===
        "Encerradas"
      ) {

        matchesCampaignFilter =
          remainingText ===
          "Encerrada";
      }

      if (
        campaignFilter ===
        "Metas batidas"
      ) {

        matchesCampaignFilter =
          progress >= 100;
      }

      if (
        campaignFilter ===
        "Perto de encerrar"
      ) {

        const days =
          Number(
            remainingText.replace(
              /\D/g,
              ""
            )
          );

        matchesCampaignFilter =
          days > 0 &&
          days <= 7;
      }


      const createdDate =
  campaign.createdAt?.toDate
    ? campaign.createdAt.toDate()
    : null;

if (
  createdDate &&
  periodFilter !== "all"
) {

  const now =
    new Date();

  const diffDays =
    Math.floor(
      (
        now.getTime() -
        createdDate.getTime()
      ) /
      (1000 * 60 * 60 * 24)
    );

  if (
    periodFilter === "7"
  ) {

    matchesPeriod =
      diffDays <= 7;

  }

  if (
    periodFilter === "14"
  ) {

    matchesPeriod =
      diffDays <= 14;

  }

  if (
    periodFilter === "month"
  ) {

    matchesPeriod =
      createdDate.getMonth() ===
        now.getMonth() &&
      createdDate.getFullYear() ===
        now.getFullYear();

  }

  if (
    periodFilter === "lastMonth"
  ) {

    const lastMonth =
      new Date();

    lastMonth.setMonth(
      now.getMonth() - 1
    );

    matchesPeriod =
      createdDate.getMonth() ===
        lastMonth.getMonth() &&
      createdDate.getFullYear() ===
        lastMonth.getFullYear();

  }

  if (
    periodFilter === "3months"
  ) {

    matchesPeriod =
      diffDays <= 90;

  }

  if (
    periodFilter === "year"
  ) {

    matchesPeriod =
      createdDate.getFullYear() ===
      now.getFullYear();

  }

}

      return (
  matchesSearch &&
  matchesCategory &&
  matchesCampaignFilter &&
  matchesPeriod
);

    })
    .sort((a, b) => {

      if (
        campaignFilter ===
        "Maiores arrecadações"
      ) {

        return (
          parseMoney(
            b.raisedAmount
          ) -
          parseMoney(
            a.raisedAmount
          )
        );
      }

      const dateA =
        a.createdAt?.seconds || 0;

      const dateB =
        b.createdAt?.seconds || 0;

      return dateB - dateA;

    });


    
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
  value={searchTerm}
  onChange={(event) =>
    setSearchTerm(
      event.target.value
    )
  }
/>

          </div>

         <div className="crowdfunding-actions">

  <select
    className="crowdfunding-select"
    value={campaignFilter}
    onChange={(event) =>
      setCampaignFilter(
        event.target.value
      )
    }
  >

    <option>
      Todas
    </option>

    <option>
      Abertas
    </option>

    <option>
      Recentes
    </option>

    <option>
      Perto de encerrar
    </option>

    <option>
      Encerradas
    </option>

    <option>
      Metas batidas
    </option>

    <option>
      Maiores arrecadações
    </option>

  </select>

  <select
    className="crowdfunding-select"
    value={periodFilter}
    onChange={(event) =>
      setPeriodFilter(
        event.target.value
      )
    }
  >

    <option value="all">
      Desde o início
    </option>

    <option value="7">
      Últimos 7 dias
    </option>

    <option value="14">
      Últimos 14 dias
    </option>

    <option value="lastMonth">
      Mês passado
    </option>

    <option value="month">
      Este mês
    </option>

    <option value="3months">
      Últimos 3 meses
    </option>

    <option value="year">
      Este ano
    </option>

  </select>

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

   <button
  className={
    selectedCategory === "Todos"
      ? "active"
      : ""
  }
  onClick={() =>
    setSelectedCategory(
      "Todos"
    )
  }
>
      <HeartHandshake size={16} />
      Todos
    </button>

   <button
  className={
    selectedCategory === "Educação"
      ? "active"
      : ""
  }
  onClick={() =>
    setSelectedCategory(
      "Educação"
    )
  }
>
      <GraduationCap size={16} />
      Educação
    </button>

   <button
  className={
    selectedCategory === "Emergenciais"
      ? "active"
      : ""
  }
  onClick={() =>
    setSelectedCategory(
      "Emergenciais"
    )
  }
>
      <TriangleAlert size={16} />
      Emergenciais
    </button>

   <button
  className={
    selectedCategory === "Empatia"
      ? "active"
      : ""
  }
  onClick={() =>
    setSelectedCategory(
      "Empatia"
    )
  }
>
      <HandHeart size={16} />
      Empatia
    </button>

    <button
  className={
    selectedCategory === "Esporte"
      ? "active"
      : ""
  }
  onClick={() =>
    setSelectedCategory(
      "Esporte"
    )
  }
>
      <Trophy size={16} />
      Esporte
    </button>

    <button
  className={
    selectedCategory === "Geração de renda"
      ? "active"
      : ""
  }
  onClick={() =>
    setSelectedCategory(
      "Geração de renda"
    )
  }
>
      <BriefcaseBusiness size={16} />
      Geração de renda
    </button>

    <button
  className={
    selectedCategory === "Moradia"
      ? "active"
      : ""
  }
  onClick={() =>
    setSelectedCategory(
      "Moradia"
    )
  }
>
      <House size={16} />
      Moradia
    </button>

  <button
  className={
    selectedCategory === "Projetos sociais"
      ? "active"
      : ""
  }
  onClick={() =>
    setSelectedCategory(
      "Projetos sociais"
    )
  }
>
      <HeartHandshake size={16} />
      Projetos sociais
    </button>

    <button
  className={
    selectedCategory === "Recorrente"
      ? "active"
      : ""
  }
  onClick={() =>
    setSelectedCategory(
      "Recorrente"
    )
  }
>
      <Repeat size={16} />
      Recorrente
    </button>

   <button
  className={
    selectedCategory === "Saúde"
      ? "active"
      : ""
  }
  onClick={() =>
    setSelectedCategory(
      "Saúde"
    )
  }
>
      <HeartPulse size={16} />
      Saúde
    </button>

  </div>

</div>

          </aside>

          <div className="crowdfunding-grid">

           {loading ? (

  <p>
    Carregando campanhas...
  </p>

) : filteredCampaigns.length === 0 ? (

  <div className="campaigns-empty">

    <strong>
      Nenhuma vaquinha encontrada
    </strong>

    <p>
      Não encontramos campanhas para os filtros selecionados.
    </p>

  </div>

) : (

  filteredCampaigns.map((campaign) => (
              <div
  key={campaign.id}
  className="campaign-card"
  onClick={() =>
    navigate(
      `/vaquinha/${campaign.slug}`
    )
  }
>

                <div className="campaign-image">

                  <img
                    src={campaign.imageUrl}
                    alt=""
                  />

                  <button
  className={`save-button ${
    savedCampaigns.includes(
      campaign.id
    )
      ? "active"
      : ""
  }`}
  onClick={(event) => {

    event.stopPropagation();

    handleSaveCampaign(
      campaign.id
    );

  }}
>
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

                  <p className="campaign-description">

  {truncateStory(
    campaign.story
  )}

</p>

                  <div className="campaign-progress-info">

                    <small>
                     {calculateRemainingDays(
  campaign.duration,
  campaign.createdAt
)}
                    </small>

                    <small>
                     {calculateProgress(
  campaign.raisedAmount,
  campaign.goalAmount
)}%
                    </small>

                  </div>

                  <div className="campaign-progress">
                    <div
                      style={{
                       width: `${calculateProgress(
  campaign.raisedAmount,
  campaign.goalAmount
)}%`,
                      }}
                    />
                  </div>

                 <strong>
  {
    formatMoney(
      campaign.raisedAmount
    )
  }
</strong>

                  <span className="campaign-goal">
               Meta de {
  formatMoney(
    campaign.goalAmount
  )
}
                  </span>

                </div>

              </div>
            )) )}

            

         


            

          </div>

        </div>

      </div>

    </section>
  );
}
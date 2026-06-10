import "./Campaigns.css";

import {
  useState,
  useEffect,
} from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
  limit,
} from "firebase/firestore";

import { db }
  from "../../services/firebase";


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

import {
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import {
  auth,
} from "../../services/firebase";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { useToast }
  from "../../contexts/ToastContext";


type Campaign = {
  id: string;

  slug: string;

  title: string;

  story: string;

  category: string;

  imageUrl: string;

  raisedAmount: string;

  goalAmount: string;

  duration: string;

  status: string;

  createdAt?: any;
};

export function Campaigns() {

const [campaigns, setCampaigns] =
  useState<Campaign[]>([]);


const navigate = useNavigate();


const [slide, setSlide] = useState(0);

const [activeFilter, setActiveFilter] =
  useState("Todos");


const maxSlide =
  window.innerWidth <= 980 ? 4 : 1;

const [savedCampaigns, setSavedCampaigns] =
  useState<string[]>([]);

const { showToast } =
  useToast();

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
      ),
      limit(6)
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

              setSavedCampaigns(
                snapshot.docs.map(
                  (doc) => doc.id
                )
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
  raised: string,
  goal: string
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

  if (!totalDays) {
    return "Sem prazo";
  }

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




const filters = [
  {
    label: "Todos",
    icon: HeartHandshake,
  },
  {
    label: "Educação",
    icon: GraduationCap,
  },
  {
    label: "Emergenciais",
    icon: TriangleAlert,
  },
  {
    label: "Empatia",
    icon: HandHeart,
  },
  {
    label: "Esporte",
    icon: Trophy,
  },
  {
    label: "Geração de renda",
    icon: BriefcaseBusiness,
  },
  {
    label: "Moradia",
    icon: House,
  },
  {
    label: "Projetos sociais",
    icon: HeartHandshake,
  },
  {
    label: "Recorrente",
    icon: Repeat,
  },
  {
    label: "Saúde",
    icon: HeartPulse,
  },
];

const filteredCampaigns =
  activeFilter === "Todos"
    ? campaigns
    : campaigns.filter(
        (campaign) =>
          campaign.category ===
          activeFilter
      );


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

            {filters.map((filter) => {

  const Icon = filter.icon;

  return (

    <button
      key={filter.label}
      className={
        activeFilter === filter.label
          ? "active"
          : ""
      }
      onClick={() =>
        setActiveFilter(
          filter.label
        )
      }
    >

      <Icon size={16} />

      {filter.label}

    </button>

  );
})}

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

          {filteredCampaigns.map(
  (campaign) => (
          <div
  key={campaign.id}
  className="campaign-card"
  onClick={() =>
    navigate(`/vaquinha/${campaign.slug}`)
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

              <div className="campaign-content">

                <span className="campaign-category">
                  {campaign.category.toUpperCase()}
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
 {formatMoney(
   campaign.raisedAmount
 )}
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

            
          ))}

          

        

        </div>

          {filteredCampaigns.length === 0 && (

  <div className="empty-campaigns">

    Nenhuma vaquinha encontrada

  </div>

)}

      </div>

    </section>
  );
}
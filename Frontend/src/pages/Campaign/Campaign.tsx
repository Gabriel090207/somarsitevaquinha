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

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db }
  from "../../services/firebase";

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


type CampaignData = {
  id: string;

  slug: string;

  title: string;

  story: string;

  category: string;

  imageUrl: string;

  raisedAmount: string | number;

goalAmount: string | number;

  duration: string;

  topics?: string[];

  createdAt?: any;

  beneficiaryName?: string;
};

export function Campaign() {

const { slug } =
  useParams();

const [
  activeTab,
  setActiveTab,
] = useState("history");

const [campaign, setCampaign] =
  useState<CampaignData | null>(
    null
  );

const [loading, setLoading] =
  useState(true);


const [isSaved, setIsSaved] =
  useState(false);

const { showToast } =
  useToast();
 

const [
  sidebarStopped,
  setSidebarStopped,
] = useState(false);


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

const collected =
  parseMoney(
    campaign?.raisedAmount
  );

const goal =
  parseMoney(
    campaign?.goalAmount
  );

const percentage =
  goal
    ? Math.round(
        (collected / goal) * 100
      )
    : 0;

function calculateRemainingDays() {

  if (
    !campaign?.duration
  ) {

    return "Sem prazo";
  }

  const totalDays =
    Number(
      campaign.duration.replace(
        /\D/g,
        ""
      )
    );

  if (
    !campaign.createdAt?.toDate
  ) {

    return `${totalDays} dias restantes`;
  }

  const createdDate =
    campaign.createdAt.toDate();

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

  if (!slug) return;

  const campaignsRef =
    collection(db, "campaigns");

  const q =
    query(
      campaignsRef,
      where(
        "slug",
        "==",
        slug
      )
    );

  const unsubscribe =
    onSnapshot(
      q,
      (snapshot) => {

        console.log(slug);

        console.log(
  snapshot.docs.map((doc) => doc.data())
);

        if (
          !snapshot.empty
        ) {

          const data = {
            id:
              snapshot.docs[0].id,

            ...snapshot.docs[0].data(),
          } as CampaignData;

          setCampaign(data);
        }

        setLoading(false);
      }
    );

  return () => unsubscribe();

}, [slug]);

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


useEffect(() => {

  const unsubscribeAuth =
    onAuthStateChanged(
      auth,
      (user) => {

        if (!user || !campaign) return;

        const savedRef =
          doc(
            db,
            "users",
            user.uid,
            "savedCampaigns",
            campaign.id
          );

        const unsubscribeSaved =
          onSnapshot(
            savedRef,
            (snapshot) => {

              setIsSaved(
                snapshot.exists()
              );

            }
          );

        return () =>
          unsubscribeSaved();
      }
    );

  return () =>
    unsubscribeAuth();

}, [campaign]);

if (loading) {

  return (
    <main className="campaign-page">
      Carregando campanha...
    </main>
  );
}

if (!campaign) {

  return (
    <main className="campaign-page">
      Campanha não encontrada.
    </main>
  );
}

function formatCreatedDate() {

  if (
    !campaign?.createdAt?.toDate
  ) {

    return "";
  }

  return campaign.createdAt
    .toDate()
    .toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
}


async function handleSaveCampaign() {

  const user =
    auth.currentUser;

  if (!user) {

    showToast(
      "Faça login para salvar campanhas.",
      "error"
    );

    return;
  }

  if (!campaign) return;

  const saveRef =
    doc(
      db,
      "users",
      user.uid,
      "savedCampaigns",
      campaign.id
    );

  if (isSaved) {

    await deleteDoc(saveRef);

    showToast(
      "Campanha removida dos salvos.",
      "info"
    );

  } else {

    await setDoc(saveRef, {

      campaignId:
        campaign.id,

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

    <main className="campaign-page">

      <section className="campaign-container">

        <div className="campaign-layout campaign-layout-limit">

          <div className="campaign-main">

            <div className="campaign-title-area">

              <span>
                {campaign.category}
              </span>

              <h1>
                {campaign.title}
              </h1>

              <p>
                Ajude essa campanha com qualquer valor.
              </p>

            </div>

            <div className="campaign-gallery">

              <button
  className={`campaign-follow-floating ${
    isSaved
      ? "active"
      : ""
  }`}
  onClick={(event) => {

    event.preventDefault();

    handleSaveCampaign();

  }}
>

  <Bookmark size={18} />

</button>

              <img
                src={campaign.imageUrl}
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
  {campaign.story}
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

  {campaign.topics?.map(
    (topic) => (

      <span key={topic}>
        {topic}
      </span>

    )
  )}

</div>

              <div className="campaign-meta">

                <span>
                  <Calendar size={18} />
                  Criado em {formatCreatedDate()}
                </span>

                <span>
                  <Tag size={18} />
                  {campaign.category}
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
  {
    formatMoney(
      campaign.raisedAmount
    )
  }
</h2>
              <p>
  De {
    formatMoney(
      campaign.goalAmount
    )
  }
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
                 {calculateRemainingDays()}
                </span>

                <span>
                  {percentage}%
                </span>

              </div>

              <Link
  to={`/checkout/${campaign.slug}`}
  className="campaign-donate-button"
>

  Quero Doar

</Link>

            </div>

            <button className="campaign-share-button">

              <Share2 size={18} />

              Compartilhar vaquinha

            </button>

           

          </aside>

        </div>

      </section>

    </main>

  );
}
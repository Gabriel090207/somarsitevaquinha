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
  Users,
  Trash2,
  Heart,
} from "lucide-react";

import {
  useParams,
  useNavigate,
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
  addDoc,
  getDoc,
  updateDoc,
arrayUnion,
arrayRemove,
increment,
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

type DonorData = {
  id: string;

  donorName: string;

  amount: number;

  createdAt?: any;
};

type MessageData = {

  id: string;

  userName: string;

  message: string;

  likes?: number;

  likedBy?: string[];

  createdAt?: any;

  userId: string;

};

export function Campaign() {

const navigate =
  useNavigate();

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


const [donors, setDonors] =
  useState<DonorData[]>([]);

const [showAllDonors, setShowAllDonors] =
  useState(false);

const [
  messages,
  setMessages,
] = useState<MessageData[]>([]);

const [
  newMessage,
  setNewMessage,
] = useState("");

const { showToast } =
  useToast();
 

const [
  sidebarStopped,
  setSidebarStopped,
] = useState(false);


const [
  showDeleteMessageModal,
  setShowDeleteMessageModal
] = useState(false);

const [
  closingDeleteMessageModal,
  setClosingDeleteMessageModal
] = useState(false);

const [
  selectedMessage,
  setSelectedMessage
] = useState<any>(null);

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

  if (!campaign?.id) return;

  const donationsRef =
    collection(
      db,
      "donations"
    );

  const q =
  query(
    donationsRef,
    where(
      "campaignId",
      "==",
      campaign.id
    )
  );

  const unsubscribe =
    onSnapshot(
      q,
      (snapshot) => {

        const data =
          snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          ) as DonorData[];

          data.sort(
  (a, b) => {

    const aTime =
      a.createdAt?.toDate?.()
        ?.getTime?.() || 0;

    const bTime =
      b.createdAt?.toDate?.()
        ?.getTime?.() || 0;

    return bTime - aTime;

  }
);

        setDonors(data);
      }
    );

    

  return () =>
    unsubscribe();

}, [campaign?.id]);


useEffect(() => {

  if (!campaign?.id) return;

  const messagesRef =
    collection(
      db,
      "campaignMessages"
    );

  const q =
    query(
      messagesRef,
      where(
        "campaignId",
        "==",
        campaign.id
      )
    );

  const unsubscribe =
    onSnapshot(
      q,
      (snapshot) => {

        const data =
          snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          ) as MessageData[];

        data.sort(
          (a, b) => {

            const aTime =
              a.createdAt?.toDate?.()
                ?.getTime?.() || 0;

            const bTime =
              b.createdAt?.toDate?.()
                ?.getTime?.() || 0;

            return bTime - aTime;

          }
        );

        setMessages(data);

      }
    );

  return () =>
    unsubscribe();

}, [campaign?.id]);


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

function formatTimeAgo(
  timestamp: any
) {

  if (!timestamp?.toDate) {
    return "";
  }

  const date =
    timestamp.toDate();

  const now =
    new Date();

  const diff =
    now.getTime() -
    date.getTime();

  const minutes =
    Math.floor(
      diff / 60000
    );

  if (minutes < 1) {
    return "agora";
  }

  if (minutes < 60) {
    return `há ${minutes} min`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `há ${hours}h`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  if (days < 30) {
    return `há ${days} dias`;
  }

  const months =
    Math.floor(
      days / 30
    );

  if (months < 12) {
    return `há ${months} meses`;
  }

  const years =
    Math.floor(
      months / 12
    );

  return `há ${years} anos`;
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

async function handleSendMessage() {

  const user =
    auth.currentUser;

  if (!user) {

    showToast(
      "Faça login para comentar.",
      "error"
    );

    return;
  }

  if (
    !newMessage.trim()
  ) {

    showToast(
      "Digite uma mensagem.",
      "error"
    );

    return;
  }

  const userDoc =
    await getDoc(
      doc(
        db,
        "users",
        user.uid
      )
    );

  const userName =
    userDoc.data()?.name ||
    "Usuário";

 await addDoc(
  collection(
    db,
    "campaignMessages"
  ),
  {

    campaignId:
      campaign?.id,

    userId:
      user.uid,

    userName:
      userName,

    message:
      newMessage.trim(),

    likes: 0,

    likedBy: [],

    createdAt:
      new Date(),

  }
);

  setNewMessage("");

  showToast(
    "Mensagem enviada!",
    "success"
  );

}


async function handleLikeMessage(
  message: MessageData
) {

  const user =
    auth.currentUser;

  if (!user) {

    showToast(
      "Faça login para curtir.",
      "error"
    );

    return;
  }

  const messageRef =
    doc(
      db,
      "campaignMessages",
      message.id
    );

  const alreadyLiked =
    message.likedBy?.includes(
      user.uid
    );

  if (alreadyLiked) {

    await updateDoc(
      messageRef,
      {

        likes:
          increment(-1),

        likedBy:
          arrayRemove(
            user.uid
          ),

      }
    );

  } else {

    await updateDoc(
      messageRef,
      {

        likes:
          increment(1),

        likedBy:
          arrayUnion(
            user.uid
          ),

      }
    );

  }

}


function handleCloseDeleteMessageModal() {

  setClosingDeleteMessageModal(
    true
  );

  setTimeout(() => {

    setShowDeleteMessageModal(
      false
    );

    setClosingDeleteMessageModal(
      false
    );

    setSelectedMessage(null);

  }, 250);

}

async function handleDeleteMessage() {

  if (!selectedMessage)
    return;

  await deleteDoc(
    doc(
      db,
      "campaignMessages",
      selectedMessage.id
    )
  );

  handleCloseDeleteMessageModal();

  showToast(
    "Comentário excluído com sucesso.",
    "success"
  );

}

async function handleShareCampaign() {

  const url =
    `${window.location.origin}/vaquinha/${campaign?.slug}`;

  try {

    if (navigator.share) {

      await navigator.share({

        title:
          campaign?.title,

        text:
          `💚 ${campaign?.title}

Ajude esta campanha na Somar.`,

        url,

      });

      return;

    }

    const shareText =

`💚 *${campaign?.title}*

Ajude esta campanha na Somar.

${url}`;

    await navigator.clipboard.writeText(
      shareText
    );

    showToast(
      "Link copiado com sucesso!",
      "success"
    );

  } catch (error) {

    console.log(error);

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
  {donors.length}
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

             <span>
  {messages.length}
</span>

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
  {donors.length}
</span>

                  </h3>

                 {(showAllDonors
  ? donors
  : donors.slice(0, 3)
).map((donor) => (

    <div
      key={donor.id}
      className="donor-item"
    >

     <div className="donor-avatar">

  {
    donor.donorName
      ?.charAt(0)
      ?.toUpperCase()
  }

</div>

      <section>

        <strong>
          {donor.donorName}
        </strong>

      <p>

  {Number(
    donor.amount || 0
  ).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  )}

  <span className="donor-time">

  <span>•</span>

  {formatTimeAgo(
    donor.createdAt
  )}

</span>

</p>

      </section>

    </div>

))}

                  {donors.length > 3 && (

  <button
    className="campaign-see-more"
    onClick={() =>
      setShowAllDonors(
        !showAllDonors
      )
    }
  >

    {showAllDonors
      ? "Ver menos"
      : "Ver mais"}

  </button>

)}

                </div>

              )

            }

            {

              activeTab === "messages" && (

                <div className="campaign-messages">

                  <h3>
                    Mensagens

                  <span>
  {messages.length}
</span>

                  </h3>

                  <div className="campaign-message-form">

  <textarea
  placeholder="Deixe uma mensagem de apoio..."
  value={newMessage}
  onFocus={() => {

    if (!auth.currentUser) {

      navigate(
        "/login",
        {
          state: {
            message:
              "Faça login para comentar.",

            redirectTo:
              `/vaquinha/${campaign.slug}`,
          },
        }
      );

    }

  }}
  onChange={(e) =>
    setNewMessage(
      e.target.value
    )
  }
/>

  <button
    onClick={
      handleSendMessage
    }
  >

    Enviar

  </button>

</div>

                  {messages.map((message) => (

  <div
    key={message.id}
    className="message-item"
  >

    <div className="donor-avatar">

      {
        message.userName
          ?.charAt(0)
          ?.toUpperCase()
      }

    </div>

   <section>

  <div className="message-header">

  <div>

    <strong>
      {message.userName}
    </strong>

    <small>
      {formatTimeAgo(
        message.createdAt
      )}
    </small>

  </div>

  <div className="message-actions">

   <button
  className={`message-like ${
    message.likedBy?.includes(
      auth.currentUser?.uid || ""
    )
      ? "active"
      : ""
  }`}
  onClick={() =>
    handleLikeMessage(
      message
    )
  }
>

  <Heart size={16} />

  <span>
    {message.likes || 0}
  </span>

</button>

{
  message.userId ===
  auth.currentUser?.uid && (

    <button
      className="message-delete"
      onClick={() => {

        setSelectedMessage(
          message
        );

        setShowDeleteMessageModal(
          true
        );

      }}
    >

      <Trash2 size={16} />

    </button>

  )
}

  </div>

</div>

  <p>
    {message.message}
  </p>

</section>

  </div>

))}

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

              <button
  className="campaign-donate-button"
  onClick={() => {

    if (!auth.currentUser) {

  navigate(
  "/login",
  {
    state: {
      message:
        "Faça login para realizar uma doação.",

      redirectTo:
        `/checkout/${campaign.slug}`
    }
  }
);

  return;
}

    window.location.href =
      `/checkout/${campaign.slug}`;

  }}
>

  Quero Doar

</button>

            </div>

            <button
  className="campaign-share-button"
  onClick={handleShareCampaign}
>

  <Share2 size={18} />

  Compartilhar vaquinha

</button>

           

          </aside>

        </div>

      </section>



{
  showDeleteMessageModal && (

    <div
      className={`delete-modal-overlay ${
        closingDeleteMessageModal
          ? "closing"
          : ""
      }`}
    >

      <div
        className={`delete-modal ${
          closingDeleteMessageModal
            ? "closing"
            : ""
        }`}
      >

        <h3>
          Excluir comentário?
        </h3>

        <p>
          Esta ação não poderá ser desfeita.
        </p>

        <div className="delete-modal-actions">

          <button
            className="cancel"
            onClick={
              handleCloseDeleteMessageModal
            }
          >
            Cancelar
          </button>

         <button
  className="confirm"
  onClick={
    handleDeleteMessage
  }
>
  Excluir
</button>

        </div>

      </div>

    </div>

  )
}

    </main>




  );
}
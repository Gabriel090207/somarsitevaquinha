import "./Donations.css";

import {
  useEffect,
  useState,
} from "react";


import {
  useNavigate,
} from "react-router-dom";


import {
  Bookmark,
} from "lucide-react";


import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
} from "firebase/firestore";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  auth,
  db,
} from "../../services/firebase";

type DonationType = {
  id: string;

  amount: number;

  campaignTitle: string;

  donorEmail: string;

  donorName: string;

  paymentMethod: string;

  status: string;

  createdAt: any;
};

export function Donations() {

const navigate =
  useNavigate();

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  const [
    activeTab,
    setActiveTab,
  ] = useState("single");


const [donations, setDonations] =
  useState<DonationType[]>([]);

const [followingCampaigns, setFollowingCampaigns] =
  useState<any[]>([]);

const [savedCampaignIds, setSavedCampaignIds] =
  useState<string[]>([]);

const [loading, setLoading] =
  useState(true);


const [
  subscriptions,
  setSubscriptions
] = useState<any[]>([]);

useEffect(() => {

  const unsubscribeAuth =
    onAuthStateChanged(
      auth,
      (user) => {

        if (!user) {
          setDonations([]);
          setLoading(false);
          return;
        }

        const donationsRef =
          collection(db, "donations");

        const q =
          query(
            donationsRef,
            where(
              "donorEmail",
              "==",
              user.email
            ),
            
          );

        const unsubscribeDonations =
          onSnapshot(
            q,
            (snapshot) => {

              const donationsData =
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                })) as DonationType[];

              setDonations(donationsData);

              setLoading(false);
            }
          );


          const subscriptionsRef =
  collection(
    db,
    "users",
    user.uid,
    "subscriptions"
  );

const unsubscribeSubscriptions =
  onSnapshot(
    subscriptionsRef,
    (snapshot) => {

      const data =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setSubscriptions(data);

    }
  );

        return () => {

  unsubscribeDonations();

  unsubscribeSubscriptions();

};
      }
    );

  return () =>
    unsubscribeAuth();

}, []);

useEffect(() => {

  const unsubscribeAuth =
    onAuthStateChanged(
      auth,
      (user) => {

        if (!user) {
          setFollowingCampaigns([]);
          return;
        }

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
    (doc) =>
      doc.data().campaignId
  );

console.log(
  "IDS SALVOS:",
  savedIds
);

setSavedCampaignIds(
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


useEffect(() => {

  if (
    savedCampaignIds.length === 0
  ) {

    setFollowingCampaigns([]);

    return;
  }

  const unsubscribes =
    savedCampaignIds.map(
      (campaignId) =>

        onSnapshot(
          doc(
            db,
            "campaigns",
            campaignId
          ),
          (docSnapshot) => {

            if (!docSnapshot.exists()) {
              return;
            }

            setFollowingCampaigns(
              (prev) => {

                const filtered =
                  prev.filter(
                    (item) =>
                      item.id !==
                      docSnapshot.id
                  );

                return [
                  ...filtered,
                  {
                    id:
                      docSnapshot.id,
                    ...docSnapshot.data(),
                  },
                ];
              }
            );

          }
        )
    );

  return () => {

    unsubscribes.forEach(
      (unsubscribe) =>
        unsubscribe()
    );

  };

}, [savedCampaignIds]);


const filteredDonations =
  donations
    .filter((donation) => {

      if (activeFilter === "all") {
        return true;
      }

      if (activeFilter === "following") {
        return false;
      }

      if (activeFilter === "finished") {
        return false;
      }

      return (
        donation.status ===
        activeFilter
      );

    })
    .sort((a, b) => {

      const aTime =
        a.createdAt?.toDate?.()
          ?.getTime?.() || 0;

      const bTime =
        b.createdAt?.toDate?.()
          ?.getTime?.() || 0;

      return bTime - aTime;

    });

function formatMoney(
  value: number
) {

  return value.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );
}

function parseMoney(
  value?: string | number
) {
  if (!value) return 0;

  if (typeof value === "number") {
    return value;
  }

  return (
    Number(
      value.replace(/[^\d]/g, "")
    ) / 100
  );
}

function formatCampaignMoney(
  value?: string | number
) {
  return parseMoney(value)
    .toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
}

function calculateProgress(
  raised: string | number,
  goal: string | number
) {
  const raisedValue = parseMoney(raised);
  const goalValue = parseMoney(goal);

  if (!goalValue) return 0;

  return Math.min(
    Math.round((raisedValue / goalValue) * 100),
    100
  );
}

function truncateStory(text: string) {
  if (!text) return "";

  const words = text.split(" ");

  if (words.length <= 25) return text;

  return words.slice(0, 25).join(" ") + "...";
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

  return (

    <section className="donations">

      <div className="donations-container">

        <div className="donations-header">

          <h1>
            Minhas Doações
          </h1>

          <p>
            Veja todas suas doações abaixo.
          </p>

        </div>

        <div className="donations-content">

          <aside className="donations-sidebar">

            <h3>
              Filtros
            </h3>

            <div className="donations-filters">

              <button
                className={
                  activeFilter === "all"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFilter(
                    "all"
                  )
                }
              >

                Todas

              </button>

              <button
                className={
                  activeFilter ===
                  "approved"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFilter(
                    "approved"
                  )
                }
              >

                Aprovadas

              </button>

              <button
                className={
                  activeFilter ===
                  "pending"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFilter(
                    "pending"
                  )
                }
              >

                Pendente

              </button>

              <button
                className={
                  activeFilter ===
                  "rejected"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFilter(
                    "rejected"
                  )
                }
              >

                Rejeitadas

              </button>

              <button
                className={
                  activeFilter ===
                  "following"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFilter(
                    "following"
                  )
                }
              >

                Seguindo

              </button>

              

            </div>

          </aside>

          <div className="donations-main">

            <div className="donations-tabs">

              <button
                className={
                  activeTab ===
                  "single"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "single"
                  )
                }
              >

                Avulsa

              </button>

              <button
                className={
                  activeTab ===
                  "monthly"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "monthly"
                  )
                }
              >

                Doação mensal

              </button>

            </div>


            {activeFilter === "following" ? (

  followingCampaigns.length === 0 ? (

    <div className="donations-empty">

      <p>
        Você ainda não segue
        nenhuma vaquinha.
      </p>

    </div>

  ) : (

   <div className="following-campaigns">

    {followingCampaigns.map(
  (campaign) => (

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
          alt={campaign.title}
        />

        <button
          className="save-button active"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <Bookmark size={14} />
        </button>

      </div>

      <div className="campaign-content">

        <span className="campaign-category">
          {campaign.category?.toUpperCase()}
        </span>

        <h3>
          {campaign.title}
        </h3>

        <p className="campaign-description">
          {truncateStory(campaign.story)}
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
          {formatCampaignMoney(
            campaign.raisedAmount
          )}
        </strong>

        <span className="campaign-goal">
          Meta de {
            formatCampaignMoney(
              campaign.goalAmount
            )
          }
        </span>

      </div>

    </div>

  )
)}
     

    </div>

  )

) : (

 activeTab === "monthly" ? (

  subscriptions.length === 0 ? (

    <div className="donations-empty">

      <p>
        Nenhuma doação mensal encontrada.
      </p>

    </div>

  ) : (

    <div className="donations-list">

      {subscriptions.map(
        (subscription) => (

          <div key={subscription.id}>

            <div className="next-subscription-card">

              <div>

                <strong>
                  Próxima cobrança
                </strong>

                <p>
                  {subscription.next_payment_date
                    ? new Date(
                        subscription.next_payment_date
                      ).toLocaleDateString(
                        "pt-BR"
                      )
                    : "Data não definida"}
                </p>

              </div>

              <span>
                {formatMoney(
                  subscription.amount
                )}
                
              </span>

            </div>

            <div className="donation-card">

              <div>

                <strong>
                  Doação Mensal
                </strong>

                <p>
                  {subscription.created_at?.toDate?.()
                    ?.toLocaleDateString("pt-BR")}
                  {" às "}
                  {subscription.created_at?.toDate?.()
                    ?.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </p>

              </div>

              <span>
                {formatMoney(
                  subscription.amount
                )}
              </span>

            </div>

          </div>

        )
      )}

    </div>

  )

)
: loading ? (

  <div className="donations-empty">

    <p>
      Carregando doações...
    </p>

  </div>

) : filteredDonations.length === 0 ? (

  <div className="donations-empty">

    <p>
      Nenhuma doação
      para esse filtro.
    </p>

  </div>

) : (

  <div className="donations-list">

    {filteredDonations.map(
      (donation) => (

        <div
          key={donation.id}
          className="donation-card"
        >

          <div>

            <strong>
              {donation.campaignTitle}
            </strong>

          <p>
  {donation.createdAt?.toDate?.()
    ?.toLocaleDateString("pt-BR")}
  {" às "}
  {donation.createdAt?.toDate?.()
    ?.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}
</p>
          </div>

          <span>
            {formatMoney(
              donation.amount
            )}
          </span>

        </div>

      )
    )}

    
    </div>

)

)}






          </div>

        </div>

      </div>

    </section>

  );
}
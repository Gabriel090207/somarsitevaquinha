import "./Dashboard.css";

import {
  useEffect,
  useState,
} from "react";

import {
  orderBy,
  limit,
} from "firebase/firestore";

import { Sidebar }
  from "../../components/Sidebar/Sidebar";

import {
  HandHeart,
  Users,
  Wallet,
  Activity,
  CreditCard,
} from "lucide-react";


import { SiPix }
  from "react-icons/si";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db }
  from "../../services/firebase";

type Campaign = {
  goalAmount?: string;
  raisedAmount?: string | number;
};



export function Dashboard() {

  const [campaignsCount, setCampaignsCount] =
    useState(0);

  const [usersCount, setUsersCount] =
    useState(0);

  const [totalRaised, setTotalRaised] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [recentDonations, setRecentDonations] =
    useState<any[]>([]);

  const [todayDonations, setTodayDonations] =
    useState(0);

  useEffect(() => {

  const campaignsRef =
    collection(db, "campaigns");

  const usersRef =
    collection(db, "users");

  const donationsRef =
    collection(db, "donations");

  const unsubscribeCampaigns =
    onSnapshot(
      campaignsRef,
      (snapshot) => {

        const campaigns =
          snapshot.docs.map((doc) =>
            doc.data()
          ) as Campaign[];

        setCampaignsCount(
          campaigns.length
        );

        let raised = 0;

        campaigns.forEach((campaign) => {

          const value =
            campaign.raisedAmount;

          if (typeof value === "number") {

            raised += value;

          } else if (
            typeof value === "string"
          ) {

            const numericValue =
              Number(
                value.replace(/[^\d]/g, "")
              ) / 100;

            raised += numericValue;
          }
        });

        setTotalRaised(raised);
      }
    );

  const usersQuery =
    query(
      usersRef,
      where("role", "==", "user")
    );

  const unsubscribeUsers =
    onSnapshot(
      usersQuery,
      (snapshot) => {

        setUsersCount(
          snapshot.size
        );
      }
    );

  const donationsQuery =
    query(
      donationsRef,
      orderBy("createdAt", "desc"),
      limit(5)
    );

  const unsubscribeDonations =
    onSnapshot(
      donationsQuery,
      (snapshot) => {

        const donations =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setRecentDonations(donations);

        const today =
          new Date();

        today.setHours(
          0,
          0,
          0,
          0
        );

        const todayCount =
          donations.filter(
            (donation: any) => {

              if (!donation.createdAt)
                return false;

              const donationDate =
                new Date(
                  donation.createdAt.seconds * 1000
                );

              return donationDate >= today;
            }
          ).length;

        setTodayDonations(
          todayCount
        );

        setLoading(false);
      }
    );

  return () => {

    unsubscribeCampaigns();

    unsubscribeUsers();

    unsubscribeDonations();
  };

}, []);

  function formatMoney(
    value: number
  ) {

    return new Intl.NumberFormat(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    ).format(value);
  }

  return (

    <main className="dashboard-page">

      <Sidebar />

      <section className="dashboard-content">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <span>
              Painel administrativo
            </span>

            <h1>
              Dashboard
            </h1>

          </div>

        </div>

        {/* CARDS */}

        <div className="dashboard-cards">

          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              <HandHeart size={24} />
            </div>

            <div>

              <strong>

                {loading
                  ? "..."
                  : campaignsCount}

              </strong>

              <p>
                Vaquinhas
              </p>

            </div>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              <Users size={24} />
            </div>

            <div>

              <strong>

                {loading
                  ? "..."
                  : usersCount}

              </strong>

              <p>
                Usuários
              </p>

            </div>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              <Wallet size={24} />
            </div>

            <div>

              <strong>

                {loading
                  ? "..."
                  : formatMoney(totalRaised)}

              </strong>

              <p>
                Arrecadado
              </p>

            </div>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              <Activity size={24} />
            </div>

            <div>

             <strong>

  {loading
    ? "..."
    : todayDonations}

</strong>

              <p>
                Doações hoje
              </p>

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="dashboard-table-wrapper">

          <div className="dashboard-table-header">

            <div>

              <span>
                Atividade recente
              </span>

              <h2>
                Últimas doações
              </h2>

            </div>

          </div>

         <div className="dashboard-table">

  <div className="dashboard-table-head">

    <span>
      Doador
    </span>

    <span>
      Campanha
    </span>

    <span>
      Valor
    </span>

    <span>
      Método
    </span>

  </div>

  {recentDonations.map(
    (donation) => (

    <div
  key={donation.id}
  className="dashboard-table-row"
>

  <div>

    <strong>
      {donation.donorName}
    </strong>

    <p>
      {donation.donorEmail}
    </p>

  </div>

  <strong>
    {donation.campaignTitle}
  </strong>

  <strong className="green">

    <Wallet
      size={16}
      style={{
        marginRight: 8,
      }}
    />

    {formatMoney(
      donation.amount
    )}

  </strong>

  <span
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >

    {
  donation.paymentMethod === "pix" ? (

    <>
      <SiPix size={15} />
      Pix
    </>

  ) : donation.paymentMethod === "wallet" ? (

    <>
      <Wallet size={15} />
      Carteira
    </>

  ) : (

    <>
      <CreditCard size={15} />
      Cartão
    </>

  )
}

  </span>

</div>

  ))}

</div>

        </div>

      </section>

    </main>

  );
}
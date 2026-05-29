import "./Donations.css";

import {
  useEffect,
  useState,
} from "react";


import {
  collection,
  onSnapshot,
  query,
  where,
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

const [loading, setLoading] =
  useState(true);

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

        return () =>
          unsubscribeDonations();
      }
    );

  return () =>
    unsubscribeAuth();

}, []);

const filteredDonations =
  donations.filter((donation) => {

    if (activeFilter === "all") {
      return true;
    }

    if (activeFilter === "following") {
      return false;
    }

    if (activeFilter === "finished") {
      return false;
    }

    return donation.status === activeFilter;
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

           {activeTab === "monthly" ? (

  <div className="donations-empty">

    <p>
      Nenhuma doação mensal encontrada.
    </p>

  </div>

) : loading ? (

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

)}
          </div>

        </div>

      </div>

    </section>

  );
}
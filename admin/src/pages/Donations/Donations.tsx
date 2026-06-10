import "./Donations.css";

import { Sidebar }
  from "../../components/Sidebar/Sidebar";

import {
  Search,
  Wallet,
  CreditCard,
} from "lucide-react";

import { SiPix } from "react-icons/si";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { db }
  from "../../services/firebase";

type DonationType = {
  id: string;

  amount: number;

  donorName: string;

  donorEmail: string;

  paymentMethod: string;

  campaignTitle: string;

  createdAt: any;
};

export function Donations() {

  const [search, setSearch] =
    useState("");

  const [donations, setDonations] =
    useState<DonationType[]>([]);

  useEffect(() => {

    const q = query(
      collection(db, "donations"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        const list =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as DonationType[];

        setDonations(list);
      });

    return () => unsubscribe();

  }, []);

  const filteredDonations =
    useMemo(() => {

      return donations.filter((item) => {

        return (
          item.donorName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          item.donorEmail
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          item.campaignTitle
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );
      });

    }, [donations, search]);

  function formatCurrency(
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

  function formatDate(date: any) {

    if (!date) return "";

    const formattedDate =
      new Date(
        date.seconds * 1000
      );

    return formattedDate
      .toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
  }

  return (

    <main className="donations-page">

      <Sidebar />

      <section className="donations-content">

        {/* HEADER */}

        <div className="donations-header">

          <div>

            <span>
              Financeiro
            </span>

            <h1>
              Doações
            </h1>

          </div>

        </div>

        {/* SEARCH */}

        <div className="donations-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar doação..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* LIST */}

        <div className="donations-list">

          {filteredDonations.map(
            (donation) => (

            <div
              key={donation.id}
              className="donation-item"
            >

              {/* USER */}

              <div className="donation-user">

                <div className="donation-avatar">

                  {
                    donation.donorName?.[0]
                  }

                </div>

                <div>

                  <strong>
                    {donation.donorName}
                  </strong>

                  <p>
                    {donation.donorEmail}
                  </p>

                </div>

              </div>

              {/* CAMPAIGN */}

              <div className="donation-campaign">

                <strong>
                  {donation.campaignTitle}
                </strong>

                <span>
                  Campanha beneficiada
                </span>

              </div>

              {/* VALUE */}

              <div className="donation-value">

                <Wallet size={18} />

                {
                  formatCurrency(
                    donation.amount
                  )
                }

              </div>

              {/* METHOD */}

             <div className="donation-method">

 <div className="donation-method">

  {
    donation.paymentMethod === "pix" ? (

      <>
        <SiPix size={16} />
        Pix
      </>

    ) : donation.paymentMethod === "wallet" ? (

      <>
        <Wallet size={16} />
        Carteira
      </>

    ) : (

      <>
        <CreditCard size={16} />
        Cartão
      </>

    )
  }

</div>

</div>

              {/* DATE */}

              <span className="donation-date">

                {
                  formatDate(
                    donation.createdAt
                  )
                }

              </span>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}
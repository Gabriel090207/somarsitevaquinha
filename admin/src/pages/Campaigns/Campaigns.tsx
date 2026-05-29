import "./Campaigns.css";

import {
  useEffect,
  useState,
} from "react";

import { Sidebar }
  from "../../components/Sidebar/Sidebar";

import {
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { Link }
  from "react-router-dom";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db }
  from "../../services/firebase";

type Campaign = {
  id: string;

  slug: string;

  title: string;

  category: string;

  raisedAmount: string;

  status: string;

  imageUrl: string;

  createdAt?: any;
};

export function Campaigns() {

  const [campaigns, setCampaigns] =
    useState<Campaign[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function fetchCampaigns() {

      try {

        const querySnapshot =
          await getDocs(
            collection(db, "campaigns")
          );

        const campaignsData =
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Campaign[];

        setCampaigns(campaignsData);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    }

    fetchCampaigns();

  }, []);

function formatCurrency(
  value: number | string
) {

  const amount =
    Number(value || 0);

  return amount.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );
}

  return (

    <main className="campaigns-page">

      <Sidebar />

      <section className="campaigns-content">

        {/* HEADER */}

        <div className="campaigns-header">

          <div>

            <span>
              Gerenciamento
            </span>

            <h1>
              Vaquinhas
            </h1>

          </div>

          <Link
            to="/vaquinhas/nova"
            className="new-campaign-btn"
          >

            <Plus size={20} />

            Nova vaquinha

          </Link>

        </div>

        {/* LIST */}

        <div className="campaigns-list">

          {loading ? (

            <p>
              Carregando vaquinhas...
            </p>

          ) : campaigns.length === 0 ? (

            <p>
              Nenhuma vaquinha encontrada.
            </p>

          ) : (

            campaigns.map((campaign) => (

              <div
                className="campaign-item"
                key={campaign.id}
              >

                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                />

                <div className="campaign-info">

                  <strong>
                    {campaign.title}
                  </strong>

                  <p>
                    {campaign.category}
                  </p>

                </div>

                <div className="campaign-money">

                  <strong>
  {formatCurrency(
    campaign.raisedAmount
  )}
</strong>

                  <span>
                    arrecadados
                  </span>

                </div>

                <div
                  className={`campaign-status ${campaign.status.toLowerCase()}`}
                >
                  {campaign.status}
                </div>

                <div className="campaign-actions">

                  <Link
  to={`/vaquinhas/editar/${campaign.slug}`}
>

  <Pencil size={18} />

</Link>

                  <button className="delete">

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </section>

    </main>

  );
}
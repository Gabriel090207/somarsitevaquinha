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
  Search,
} from "lucide-react";

import { Link }
  from "react-router-dom";

import {
  deleteDoc,
  doc,
  collection,
  getDocs,
} from "firebase/firestore";


import { useToast }
  from "../../contexts/ToastContext";


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

    const [search, setSearch] =
  useState("");


    const [showDeleteModal, setShowDeleteModal] =
  useState(false);

  const [closingModal, setClosingModal] =
  useState(false);

const [selectedCampaign, setSelectedCampaign] =
  useState<Campaign | null>(null);

  const { showToast } =
  useToast();

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

campaignsData.sort(
  (a, b) =>
    b.createdAt?.seconds -
    a.createdAt?.seconds
);

setCampaigns(campaignsData);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    }

    fetchCampaigns();

  }, []);


useEffect(() => {

  if (!showDeleteModal) return;

  const scrollY =
    window.scrollY;

  document.body.style.position =
    "fixed";

  document.body.style.top =
    `-${scrollY}px`;

  document.body.style.left =
    "0";

  document.body.style.right =
    "0";

  document.body.style.width =
    "100%";

  return () => {

    document.body.style.position =
      "";

    document.body.style.top =
      "";

    document.body.style.left =
      "";

    document.body.style.right =
      "";

    document.body.style.width =
      "";

    window.scrollTo(
      0,
      scrollY
    );

  };

}, [showDeleteModal]);


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


function handleOpenDeleteModal(
  campaign: Campaign
) {

  setSelectedCampaign(
    campaign
  );

  setShowDeleteModal(true);
}

function handleCloseModal() {

  setClosingModal(true);

  setTimeout(() => {

    setShowDeleteModal(false);

    setClosingModal(false);

    setSelectedCampaign(null);

  }, 250);

}

async function handleDeleteCampaign() {

  if (!selectedCampaign) {
    return;
  }

  try {

    await deleteDoc(
      doc(
        db,
        "campaigns",
        selectedCampaign.id
      )
    );

    setCampaigns((prev) =>
      prev.filter(
        (campaign) =>
          campaign.id !==
          selectedCampaign.id
      )
    );

    showToast(
      "Vaquinha removida com sucesso.",
      "success"
    );

  } catch (error) {

    console.log(error);

    showToast(
      "Erro ao remover vaquinha.",
      "error"
    );

  } finally {

  handleCloseModal();

}
}


const filteredCampaigns =
  campaigns.filter(
    (campaign) =>
      campaign.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

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


        <div className="campaigns-search">

  <Search size={18} />

  <input
    type="text"
    placeholder="Buscar vaquinha..."
    value={search}
    onChange={(event) =>
      setSearch(
        event.target.value
      )
    }
  />

</div>

        {/* LIST */}

        <div className="campaigns-list">

          {loading ? (

            <p>
              Carregando vaquinhas...
            </p>

          ) : filteredCampaigns.length === 0? (

            <p>
              Nenhuma vaquinha encontrada.
            </p>

          ) : (

            filteredCampaigns.map((campaign) => (

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

                  <button
  className="delete"
  onClick={() =>
    handleOpenDeleteModal(
      campaign
    )
  }
>

  <Trash2 size={18} />

</button>

                </div>

              </div>

            ))

          )}

        </div>

      </section>


      {showDeleteModal && (

  <div
  className={`delete-modal-overlay ${
    closingModal
      ? "closing"
      : ""
  }`}
>

  <div
    className={`delete-modal ${
      closingModal
        ? "closing"
        : ""
    }`}
  >

      <h3>
        Excluir vaquinha
      </h3>

      <p>
        Tem certeza que deseja
        excluir esta vaquinha?
      </p>

      <div className="delete-modal-actions">

        <button
          className="cancel"
          onClick={handleCloseModal}
        >

          Cancelar

        </button>

        <button
          className="confirm"
          onClick={
            handleDeleteCampaign
          }
        >

          Excluir

        </button>

      </div>

    </div>

  </div>

)}

    </main>

  );
}
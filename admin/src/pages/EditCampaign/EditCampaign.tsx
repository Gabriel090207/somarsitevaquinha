import "../CreateCampaign/CreateCampaign.css";

import { Sidebar }
  from "../../components/Sidebar/Sidebar";

import {
  useState,
  useEffect,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  Save,
  UploadCloud,
  MapPin,
  Wallet,
 User,
  Clock3,
  Tag,
  X,
} from "lucide-react";


import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import {
  db,
  storage,
} from "../../services/firebase";

import { Toast }
  from "../../components/Toast/Toast";

import { useToast }
  from "../../contexts/ToastContext";

export function EditCampaign() {


const {
  toast,
  showToast,
  closeToast,
} = useToast();

const { slug } =
  useParams();

const [coverPreview, setCoverPreview] =
  useState<string | null>(null);

const [coverFile, setCoverFile] =
  useState<File | null>(null);

const [loading, setLoading] =
  useState(false);

const [title, setTitle] =
  useState("");

const [category, setCategory] =
  useState("Saúde");

const [duration, setDuration] =
  useState("");

const [topic1, setTopic1] =
  useState("");

const [topic2, setTopic2] =
  useState("");

const [topic3, setTopic3] =
  useState("");

const [story, setStory] =
  useState("");

const [goalAmount, setGoalAmount] =
  useState("");

const [raisedAmount, setRaisedAmount] =
  useState("");

const [beneficiaryName, setBeneficiaryName] =
  useState("");

const [city, setCity] =
  useState("");

const [status, setStatus] =
  useState("Publicada");

const [campaignId, setCampaignId] =
  useState("");


function formatCurrency(
  value: string
) {

  const numbers =
    value.replace(/\D/g, "");

  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  ).format(Number(numbers) / 100);
}

function handleCoverChange(
  event: React.ChangeEvent<HTMLInputElement>
) {

  const file =
    event.target.files?.[0];

  if (!file) return;

  const imageUrl =
    URL.createObjectURL(file);

  setCoverPreview(imageUrl);

  setCoverFile(file);
}

function removeCover() {
  setCoverPreview(null);
  setCoverFile(null);
}


useEffect(() => {

  async function fetchCampaign() {

    try {

      if (!slug) return;

      const campaignsRef =
        collection(db, "campaigns");

      const q =
        query(
          campaignsRef,
          where("slug", "==", slug)
        );

      const querySnapshot =
        await getDocs(q);

      if (querySnapshot.empty) {

        showToast(
          "Vaquinha não encontrada",
          "error"
        );

        return;
      }

      const campaign =
        querySnapshot.docs[0].data();

      setCampaignId(
  querySnapshot.docs[0].id
);

      setTitle(campaign.title || "");

      setCategory(
        campaign.category || "Saúde"
      );

      setDuration(
        campaign.duration || ""
      );

      setTopic1(
        campaign.topics?.[0] || ""
      );

      setTopic2(
        campaign.topics?.[1] || ""
      );

      setTopic3(
        campaign.topics?.[2] || ""
      );

      setStory(
        campaign.story || ""
      );

      setGoalAmount(
  campaign.goalAmount
    ? formatCurrency(
        String(
          campaign.goalAmount
        )
      )
    : ""
);

setRaisedAmount(
  campaign.raisedAmount
    ? formatCurrency(
        String(
          campaign.raisedAmount
        )
      )
    : ""
);

      setBeneficiaryName(
        campaign.beneficiaryName || ""
      );

      setCity(
        campaign.city || ""
      );

      setStatus(
        campaign.status || "Publicada"
      );

      setCoverPreview(
        campaign.imageUrl || null
      );

    } catch (error) {

      showToast(
        "Erro ao carregar vaquinha",
        "error"
      );
    }
  }

  fetchCampaign();

}, [slug]);


function parseCurrency(
  value: string
) {

  return Number(
    value.replace(/[^\d]/g, "")
  ) / 100;
}


async function handleUpdateCampaign() {

  try {

    setLoading(true);

    if (
      !coverPreview ||
      !title.trim() ||
      !category.trim() ||
      !duration.trim() ||
      !story.trim() ||
      !goalAmount.trim() ||
      !beneficiaryName.trim() ||
      !city.trim()
    ) {

      showToast(
        "Preencha todos os dados",
        "error"
      );

      setLoading(false);

      return;
    }

    let imageUrl =
      coverPreview;

    if (coverFile) {

      const imageRef =
        ref(
          storage,
          `campaigns/${Date.now()}-${coverFile.name}`
        );

      await uploadBytes(
        imageRef,
        coverFile
      );

      imageUrl =
        await getDownloadURL(imageRef);
    }

    const slug =
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    const campaignRef =
      doc(
        db,
        "campaigns",
        campaignId
      );

    await updateDoc(
      campaignRef,
      {
        title,

        slug,

        category,

        duration,

        topics: [
          topic1,
          topic2,
          topic3,
        ].filter(Boolean),

        story,

        goalAmount:
  parseCurrency(
    goalAmount
  ),

raisedAmount:
  parseCurrency(
    raisedAmount
  ),

        beneficiaryName,

        city,

        status,

        imageUrl,
      }
    );

    showToast(
      "Vaquinha atualizada com sucesso",
      "success"
    );

  } catch (error) {

    showToast(
      "Erro ao atualizar vaquinha",
      "error"
    );

  } finally {

    setLoading(false);
  }
}




  return (

    <main className="create-campaign-page">

      <Sidebar />

      <section className="create-campaign-content">

        {/* HEADER */}

        <div className="create-campaign-header">

          <div>

            <span>
              Gerenciamento
            </span>

            <h1>
              Editar vaquinha
            </h1>

          </div>

          <div className="create-campaign-actions">

           

            <button
  className="save-btn"
  onClick={handleUpdateCampaign}
  disabled={loading}
>

  <Save size={18} />

{loading
  ? "Salvando..."
  : "Salvar alterações"}

</button>

          </div>

        </div>

        {/* GRID */}

        <div className="create-campaign-grid">

          {/* MAIN */}

          <div className="create-campaign-main">

            {/* CAPA */}

           {/* CAPA */}

<div className="create-card">

  <div className="card-title">

    <strong>
      Capa da campanha
    </strong>

    <p>
      Essa imagem aparecerá na página
      da vaquinha e nas listagens.
    </p>

  </div>

  <label className="cover-upload">

    {coverPreview ? (

      <div className="cover-preview-wrapper">

        <img
          src={coverPreview}
          alt="Preview"
          className="cover-preview"
        />

       <button
  type="button"
  className="remove-cover-btn"
  onClick={(event) => {
    event.preventDefault();

    removeCover();
  }}
>

  <X size={20} />

</button>

      </div>

    ) : (

      <>

        <div className="cover-upload-icon">

          <UploadCloud size={34} />

        </div>

        <strong>
          Fazer upload da capa
        </strong>

        <span>
          PNG, JPG ou WEBP
        </span>

      </>

    )}

    <input
      type="file"
      accept="image/*"
      hidden
      onChange={handleCoverChange}
    />

  </label>

</div>

            {/* INFO */}

            <div className="create-card">

              <div className="card-title">

                <strong>
                  Informações principais
                </strong>

                <p>
                  Dados públicos da campanha.
                </p>

              </div>

              <div className="form-field">

                <label>
                  Título da campanha
                </label>

                <input
  type="text"
  placeholder="Ex: Cirurgia da Ana Clara"
  value={title}
  onChange={(event) =>
    setTitle(event.target.value)
  }
/>

              </div>

              <div className="form-grid">

                <div className="form-field">

                  <label>
                    Categoria
                  </label>

               <select
  value={category}
  onChange={(event) =>
    setCategory(event.target.value)
  }
>

  <option>
    Saúde
  </option>

  <option>
    Educação
  </option>

  <option>
    Emergenciais
  </option>

  <option>
    Empatia
  </option>

  <option>
    Esporte
  </option>

  <option>
    Geração de renda
  </option>

  <option>
    Moradia
  </option>

  <option>
    Projetos sociais
  </option>

  <option>
    Recorrente
  </option>

</select>

                </div>

                <div className="form-field">

                  <label>
                    Tempo da vaquinha
                  </label>

                  <div className="input-icon">

                    <Clock3 size={18} />

                   <input
  type="text"
  placeholder="Ex: 30 dias"
  value={duration}
  onChange={(event) =>
    setDuration(event.target.value)
  }
/>

                  </div>

                </div>

              </div>

            </div>

            {/* TOPICOS */}

            <div className="create-card">

              <div className="card-title">

                <strong>
                  Tópicos da campanha
                </strong>

                <p>
                  Adicione até 3 tópicos.
                </p>

              </div>

              <div className="form-grid">

                <div className="form-field">

                  <label>
                    Tópico 1
                  </label>

                  <div className="input-icon">

                    <Tag size={18} />

                   <input
  type="text"
  placeholder="Ex: Cirurgia"
  value={topic1}
  onChange={(event) =>
    setTopic1(event.target.value)
  }
/>

                  </div>

                </div>

                <div className="form-field">

                  <label>
                    Tópico 2
                  </label>

                  <div className="input-icon">

                    <Tag size={18} />

                   <input
  type="text"
  placeholder="Ex: Hospital"
  value={topic2}
  onChange={(event) =>
    setTopic2(event.target.value)
  }
/>

                  </div>

                </div>

              </div>

              <div className="form-field">

                <label>
                  Tópico 3
                </label>

                <div className="input-icon">

                  <Tag size={18} />

                  <input
  type="text"
  placeholder="Ex: Tratamento"
  value={topic3}
  onChange={(event) =>
    setTopic3(event.target.value)
  }
/>

                </div>

              </div>

            </div>

            {/* HISTORIA */}

            <div className="create-card">

              <div className="card-title">

                <strong>
                  História da campanha
                </strong>

                <p>
                  Explique detalhadamente a situação.
                </p>

              </div>

              <div className="form-field">

                <label>
                  Descrição completa
                </label>

               <textarea
  placeholder="Conte toda a história da campanha..."
  value={story}
  onChange={(event) =>
    setStory(event.target.value)
  }
/>

              </div>

            </div>

          </div>

          {/* SIDE */}

          <div className="create-campaign-side">

            {/* VALORES */}

            <div className="create-card">

              <div className="card-title">

                <strong>
                  Arrecadação
                </strong>

                <p>
                  Valores da campanha.
                </p>

              </div>

              <div className="form-field">

                <label>
                  Valor para arrecadar
                </label>

                <div className="input-icon">

                  <Wallet size={18} />

                  <input
  type="text"
  placeholder="R$ 0,00"
  value={goalAmount}
  onChange={(event) =>
    setGoalAmount(
      formatCurrency(
        event.target.value
      )
    )
  }
/>
                </div>

              </div>

              <div className="form-field">

                <label>
                  Valor arrecadado
                </label>

                <div className="input-icon">

                  <Wallet size={18} />

                <input
  type="text"
  placeholder="R$ 0,00"
  value={raisedAmount}
  onChange={(event) =>
    setRaisedAmount(
      formatCurrency(
        event.target.value
      )
    )
  }
/>

                </div>

              </div>

            </div>

            {/* BENEFICIARIO */}

            <div className="create-card">

              <div className="card-title">

                <strong>
                  Beneficiário
                </strong>

                <p>
                  Dados da pessoa beneficiada.
                </p>

              </div>

              <div className="form-field">

                <label>
                  Nome completo
                </label>

                <div className="input-icon">

                  <User size={18} />

                  <input
  type="text"
  placeholder="Nome completo"
  value={beneficiaryName}
  onChange={(event) =>
    setBeneficiaryName(event.target.value)
  }
/>

                </div>

              </div>

              <div className="form-field">

                <label>
                  Cidade
                </label>

                <div className="input-icon">

                  <MapPin size={18} />

                  <input
  type="text"
  placeholder="Cidade"
  value={city}
  onChange={(event) =>
    setCity(event.target.value)
  }
/>

                </div>

              </div>

            </div>

            {/* STATUS */}

            <div className="create-card">

              <div className="card-title">

                <strong>
                  Status da campanha
                </strong>

                <p>
                  Defina a visibilidade da campanha.
                </p>

              </div>

              <div className="status-options">

                <button
  type="button"
  className={`status-option ${
    status === "Publicada"
      ? "active"
      : ""
  }`}
  onClick={() =>
    setStatus("Publicada")
  }
>
  Publicada
</button>

<button
  type="button"
  className={`status-option ${
    status === "Rascunho"
      ? "active"
      : ""
  }`}
  onClick={() =>
    setStatus("Rascunho")
  }
>
  Rascunho
</button>

<button
  type="button"
  className={`status-option ${
    status === "Pausada"
      ? "active"
      : ""
  }`}
  onClick={() =>
    setStatus("Pausada")
  }
>
  Pausada
</button>
              </div>

            </div>

          </div>

        </div>

      </section>

      {toast && (

  <div className="toast-container">

    <Toast
      message={toast.message}
      type={toast.type}
      onClose={closeToast}
    />

  </div>

)}

    </main>

  );
}
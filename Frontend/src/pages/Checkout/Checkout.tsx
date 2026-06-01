import "./Checkout.css";

import { useEffect, useMemo, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { api } from "../../services/api";

import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Wallet,
} from "lucide-react";

import { SiPix } from "react-icons/si";

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
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../services/firebase";

import { QRCode } from "react-qr-code";

import { useToast } from "../../contexts/ToastContext";


declare global {

  interface Window {
    MercadoPago: any;
  }

}


type CampaignType = {
  id: string;

  title: string;

  slug: string;

  imageUrl: string;

  goalAmount: string;

  raisedAmount: string;

  beneficiaryName: string;
};

export function Checkout() {



const { showToast } = useToast();

  const { slug } = useParams();

  const navigate = useNavigate();

  const [campaign, setCampaign] =
    useState<CampaignType | null>(null);

  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(1);

  const [amount, setAmount] =
    useState("");

  
  const [paymentMethod, setPaymentMethod] =
    useState("pix");

    const [newCard, setNewCard] =
  useState(true);


const walletBalance = 0;

const donationValue =
  Number(
    amount
      .replace(/\./g, "")
      .replace(",", ".")
  ) || 0;

const hasEnoughBalance =
  walletBalance >= donationValue;

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [cpf, setCpf] = useState("");


const [pixData, setPixData] =
  useState<{
    id: string;
    status: string;
    qr_code: string;
    qr_code_base64: string;
    ticket_url: string;
  } | null>(null);

const [pixLoading, setPixLoading] =
  useState(false);

const [processing, setProcessing] =
  useState(false);

const [cardNumber, setCardNumber] =
  useState("");

const [cardExpiry, setCardExpiry] =
  useState("");

const [cardCvv, setCardCvv] =
  useState("");

const [cardHolder, setCardHolder] =
  useState("");

const [cardCpf, setCardCpf] =
  useState("");

const [cardEmail, setCardEmail] =
  useState("");

const [cardBrand, setCardBrand] =
  useState("");

const [showSaveCardModal,
  setShowSaveCardModal] =
    useState(false);


const mp =
  new window.MercadoPago(
    import.meta.env
      .VITE_MP_PUBLIC_KEY
  );


const [closingSaveCardModal,
  setClosingSaveCardModal] =
    useState(false);


const [saveCardChoice,
  setSaveCardChoice] =
    useState<boolean | null>(
      null
    );

const formatCurrency = (
  value: number
) => {

  return value.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );
};

const handleMoneyChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const value =
    e.target.value.replace(/\D/g, "");

  const formatted =
    (
      Number(value) / 100
    ).toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
      }
    );

  setAmount(formatted);
};

function detectCardBrand(
  number: string
) {

  const cleaned =
    number.replace(/\s/g, "");

  if (/^4/.test(cleaned)) {
    return "visa";
  }

  if (
    /^(5[1-5]|2[2-7])/.test(cleaned)
  ) {
    return "mastercard";
  }

  if (/^3[47]/.test(cleaned)) {
    return "amex";
  }

  if (/^4011/.test(cleaned)) {
    return "elo";
  }

  return "";
}

useEffect(() => {

  const unsubscribe =
  onAuthStateChanged(
    auth,
    async (user) => {

      if (!user) return;

      const userDoc =
        await getDoc(
          doc(db, "users", user.uid)
        );

      if (userDoc.exists()) {

        const data =
          userDoc.data();

        setName(
          data.name || ""
        );

        setEmail(
          data.email || user.email || ""
        );

        setPhone(
          data.phone || ""
        );

        setCpf(
          data.cpf || ""
        );
      }
    }
  );

  return () => unsubscribe();

}, []);

useEffect(() => {

  if (!slug) return;

  const campaignsRef =
    collection(db, "campaigns");

  const q = query(
    campaignsRef,
    where("slug", "==", slug)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {

      if (snapshot.empty) {

        setLoading(false);

        return;
      }

      const docData =
        snapshot.docs[0];

      setCampaign({
        id: docData.id,
        ...docData.data(),
      } as CampaignType);

      setLoading(false);
    }
  );

  return () => unsubscribe();

}, [slug]);




useEffect(() => {

  if (!pixData?.id) return;

  const interval = setInterval(
    async () => {

      try {

        const response =
          await api.get(
            `/payment-status/${pixData.id}`
          );

        if (
          response.data.status ===
          "approved"
        ) {

          console.log(
  "PIX APROVADO"
);

setProcessing(true);

setTimeout(() => {

  navigate(
    "/payment-success",
    {
      state: {
        amount: donationValue,
      },
    }
  );

}, 3000);

await api.post(
  "/confirm-donation",
  {
    campaign_id: campaign?.id || "",

    campaign_title: campaign?.title || "",

    amount: donationValue,

    donor_name: name,

    donor_email: email,

    payment_method: "pix",
  }
);

clearInterval(interval);

          clearInterval(interval);
        }

      } catch (error) {

        console.log(error);
      }

    },
    5000
  );

  return () =>
    clearInterval(interval);

}, [pixData]);



useEffect(() => {

  if (!showSaveCardModal) return;

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

}, [showSaveCardModal]);


  const progress = useMemo(() => {

    if (!campaign) return 0;

   const raised =
  typeof campaign.raisedAmount === "number"
    ? campaign.raisedAmount
    : Number(
        campaign.raisedAmount
          ?.replace(/[^\d]/g, "")
      ) / 100 || 0;

const goal =
  typeof campaign.goalAmount === "number"
    ? campaign.goalAmount
    : Number(
        campaign.goalAmount
          ?.replace(/[^\d]/g, "")
      ) / 100 || 0;

    if (!goal) return 0;

    return Math.min(
      (raised / goal) * 100,
      100
    );

  }, [campaign]);

  if (loading) {
    return (
      <section className="checkout-page">
        <div className="checkout-loading">
          Carregando checkout...
        </div>
      </section>
    );
  }

  if (!campaign) {
    return (
      <section className="checkout-page">
        <div className="checkout-loading">
          Campanha não encontrada.
        </div>
      </section>
    );
  }


  
const handleCreatePix = async () => {

  try {

    setPixLoading(true);

   const response = await api.post(
  "/create-pix",
  {
    amount: donationValue,
    email,
  }
);

    console.log(response.data); 

    setPixData(response.data);

  } catch (error) {

    console.log(error);

  } finally {

    setPixLoading(false);
  }
};


const handleCardPayment =


  async () => {

   if (
  newCard &&
  saveCardChoice === null
) {

  setShowSaveCardModal(true);

  return;
}


    try {


      console.log(
  "Salvar cartão:",
  saveCardChoice
);

      setProcessing(true);

      const [month, year] =
        cardExpiry.split("/");

      const tokenResponse =
        await mp.createCardToken({

          cardNumber:
            cardNumber.replace(/\s/g, ""),

          cardholderName:
            cardHolder,

          identificationType:
            "CPF",

          identificationNumber:
            cardCpf.replace(/\D/g, ""),

          securityCode:
            cardCvv,

          expirationMonth:
            Number(month),

          expirationYear:
            Number(`20${year}`),
        });

        console.log(
  "TOKEN",
  tokenResponse
);

      const response =
  await api.post(
    "/create-card-payment",
    {
      token:
        tokenResponse.id,

      issuer_id:
        tokenResponse.issuer_id,

      payment_method_id:
        tokenResponse.payment_method_id,

      installments: 1,

      amount:
        donationValue,

      email:
        cardEmail,

      campaign_id:
        campaign?.id,

      campaign_title:
        campaign?.title,

      donor_name:
        cardHolder,
    }
  );

console.log(
  "CARD RESPONSE",
  response.data
);

      setTimeout(() => {

        navigate(
          "/payment-success",
          {
            state: {
              amount:
                donationValue,
            },
          }
        );

      }, 2500);

    } catch (error) {

      console.log(error);

      setProcessing(false);

      showToast(
        "Pagamento recusado",
        "error"
      );
    }
  };


async function continueCardPayment(
  saveCard: boolean
) {

  setSaveCardChoice(
    saveCard
  );

  handleCloseSaveCardModal();

  setTimeout(() => {

    handleCardPayment();

  }, 250);

}

function handleCloseSaveCardModal() {

  setClosingSaveCardModal(true);

  setTimeout(() => {

    setShowSaveCardModal(false);

    setClosingSaveCardModal(false);

  }, 250);

}

  return (
    <section className="checkout-page">

      <div className="checkout-container">

        {/* LEFT */}

        <div className="checkout-left">

          <button
            className="checkout-back"
            onClick={() => navigate(-1)}
          >

            <ArrowLeft size={18} />

            Voltar

          </button>

          <span className="checkout-badge">
            Checkout seguro
          </span>

          <h1>
            Faça sua doação
          </h1>

          {/* STEP 1 */}

          {step === 1 && (

            <div className="checkout-card">

              <h2>
                Escolha um valor
              </h2>

              <div className="checkout-values">

                {[10, 30, 50, 100, 200].map((item) => (

                  <button
                    key={item}
                    className={
                      amount === `${item},00`
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setAmount(String(item))
                    }
                  >

                    R$ {item}

                  </button>

                ))}

              </div>

              <div className="checkout-input-wrapper">

                <span>
                  R$
                </span>

                <input
  type="text"
  placeholder="0,00"
  value={amount}
  onChange={handleMoneyChange}

/>

              </div>

              <button
  className="checkout-next-btn"
  onClick={() => setStep(2)}
  disabled={!amount}
>
  Continuar
</button>

            </div>
          )}

          {/* STEP 2 */}

          {step === 2 && (

<section className="checkout-contact">

  <div className="checkout-section-header">

    <h2>
      Contato
    </h2>

  </div>

  <div className="checkout-contact-box">

    <div className="checkout-input-group">

      <label>
        Nome
      </label>

      <input
  type="text"
  placeholder="Seu nome"
  value={name}
  onChange={(e) =>
    setName(e.target.value)
  }
/>

    </div>

    <div className="checkout-input-group">

      <label>
        E-mail
      </label>

      <input
  type="email"
  placeholder="seuemail@gmail.com"
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
/>

    </div>

    <div className="checkout-row">

      <div className="checkout-input-group">

        <label>
          CPF
        </label>

       <input
  type="text"
  placeholder="000.000.000-00"
  value={cpf}
  onChange={(e) =>
    setCpf(e.target.value)
  }
/>

      </div>

      <div className="checkout-input-group">

        <label>
          Telefone
        </label>

       <input
  type="text"
  placeholder="(00) 00000-0000"
  value={phone}
  onChange={(e) =>
    setPhone(e.target.value)
  }
/>

      </div>

    </div>

    <button
      className="checkout-next-btn"
      onClick={() => setStep(3)}
    >
      Continuar pagamento
    </button>

  </div>

</section>

)}

          {/* STEP 3 */}

            {step === 3 && (

<section className="checkout-payment">

  <div className="checkout-section-header">

    <h2>
      Pagamento
    </h2>

  </div>

  <div className="checkout-payment-box">

   {!pixData && (

<>

<h3>
  Formas de pagamento
</h3>

<div className="checkout-methods">

      <button
        className={`checkout-method ${
          paymentMethod === "pix"
            ? "active"
            : ""
        }`}
        onClick={() =>
          setPaymentMethod("pix")
        }
      >

        <SiPix size={24} />

        <span>
          Pix
        </span>

      </button>

      <button
        className={`checkout-method ${
          paymentMethod === "credit"
            ? "active"
            : ""
        }`}
        onClick={() =>
          setPaymentMethod("credit")
        }
      >

        <CreditCard size={24} />

        <span>
          Cartão
        </span>

      </button>

      <button
        className={`checkout-method ${
          paymentMethod === "wallet"
            ? "active"
            : ""
        }`}
        onClick={() =>
          setPaymentMethod("wallet")
        }
      >

        <Wallet size={24} />

        <span>
          Carteira
        </span>

      </button>

   </div>

</>

)}

  {paymentMethod === "pix" && !pixData && (

      <div className="checkout-payment-info">

        <p>
          Após clicar em doar,
          o QR Code Pix será gerado
          automaticamente para pagamento.
        </p>

      </div>

      

    )}

    {pixData && (

  <div className="checkout-pix-box">

    <div className="checkout-pix-qrcode">

      <QRCode
        value={pixData.qr_code}
        size={220}
      />

    </div>

    <div className="checkout-pix-copy">

      <textarea
        readOnly
        value={pixData.qr_code_base64}
      />

      <button
        onClick={() => {

          navigator.clipboard.writeText(
  pixData.qr_code
);

showToast(
  "Código Pix copiado!",
  "success"
);

        }}
      >
        Copiar código Pix
      </button>

    </div>

  </div>

)}

    

    {paymentMethod === "credit" && (

  <div className="checkout-card-area">

   <div className="auth-switch checkout-card-switch">

      <button
  className={!newCard ? "active" : ""}
  onClick={() => setNewCard(false)}
>
  Meus cartões
</button>

<button
  className={newCard ? "active" : ""}
  onClick={() => setNewCard(true)}
>
  Novo cartão
</button>

    </div>

    <div className="checkout-card-form">

      <div className="checkout-input-group">

  <label>
    Número do cartão
  </label>

  <div className="card-number-wrapper">

    <input
      type="text"
      placeholder="1234 5678 9012 3456"
      value={cardNumber}
      onChange={(e) => {

        const value =
          e.target.value
            .replace(/\D/g, "")
            .slice(0, 16);

        const formatted =
          value.replace(
            /(\d{4})(?=\d)/g,
            "$1 "
          );

        setCardNumber(formatted);

        setCardBrand(
          detectCardBrand(formatted)
        );
      }}
    />

    {cardBrand && (

      <img
        src={`/cards/${cardBrand}.png`}
        alt={cardBrand}
        className="card-brand-image"
      />

    )}

  </div>

</div>

      <div className="checkout-row">

        <div className="checkout-input-group">

          <label>
            Validade
          </label>

         <input
  type="text"
  placeholder="MM/AA"
  value={cardExpiry}
  onChange={(e) => {

    const value =
      e.target.value
        .replace(/\D/g, "")
        .slice(0, 4);

    let formatted = value;

    if (value.length >= 3) {

      formatted =
        value.slice(0, 2) +
        "/" +
        value.slice(2);
    }

    setCardExpiry(formatted);
  }}
/>
        </div>

        <div className="checkout-input-group">

          <label>
            CVC
          </label>

        <input
  type="text"
  placeholder="123"
  value={cardCvv}
  onChange={(e) => {

    const value =
      e.target.value
        .replace(/\D/g, "")
        .slice(0, 3);

    setCardCvv(value);
  }}
/>

        </div>

      </div>

      <div className="checkout-input-group">

        <label>
          Nome do titular
        </label>

<input
  type="text"
  placeholder="NOME COMO NO CARTÃO"
  value={cardHolder}
  onChange={(e) => {

    setCardHolder(
      e.target.value.toUpperCase()
    );
  }}
/>

      </div>

      <div className="checkout-input-group">

        <label>
          CPF do titular
        </label>

      <input
  type="text"
  placeholder="000.000.000-00"
  value={cardCpf}
  onChange={(e) => {

    const value =
      e.target.value
        .replace(/\D/g, "")
        .slice(0, 11);

    const formatted =
      value
        .replace(
          /(\d{3})(\d)/,
          "$1.$2"
        )
        .replace(
          /(\d{3})(\d)/,
          "$1.$2"
        )
        .replace(
          /(\d{3})(\d{1,2})$/,
          "$1-$2"
        );

    setCardCpf(formatted);
  }}
/>

      </div>

   <div className="checkout-input-group">

  <label>
    E-mail
  </label>

  <input
    type="email"
    placeholder="voce@email.com"
    value={cardEmail}
    onChange={(e) =>
      setCardEmail(
        e.target.value
      )
    }
  />

</div>


    </div>

  </div>

)}

    {paymentMethod === "wallet" && (

  <div className="checkout-wallet-box">

    <span>
      Seu saldo disponível
    </span>

    <div
      className={`checkout-wallet-input ${
        hasEnoughBalance
          ? "success"
          : "warning"
      }`}
    >

      <input
        type="text"
        value={formatCurrency(donationValue)}
        onChange={handleMoneyChange}
      />

      <strong>
        Saldo:
        {" "}
        {formatCurrency(walletBalance)}
      </strong>

    </div>

    {!hasEnoughBalance && (

      <p className="wallet-warning">
        Você não possui saldo suficiente
        para concluir esta doação.
      </p>

    )}

  </div>

)}

{!pixData && (

  <button
    className="checkout-donate-btn"
  disabled={
    pixLoading ||
    (
      paymentMethod === "wallet"
        ? !hasEnoughBalance
        : false
    )
  }
  onClick={() => {

   if (paymentMethod === "pix") {

  handleCreatePix();

}

if (paymentMethod === "credit") {

  setShowSaveCardModal(true);

}

  }}
>
  {
    pixLoading
      ? "Gerando Pix..."
      : `Doar ${formatCurrency(donationValue)}`
  }
</button>

)}

    <small className="checkout-terms">

      Ao continuar, você concorda
      com os Termos de Uso
      e Política de Privacidade.

    </small>

  </div>

</section>

)}
        </div>

        {/* RIGHT */}

        <aside className="checkout-sidebar">

          <img
            src={campaign.imageUrl}
            alt={campaign.title}
          />

          <div className="checkout-sidebar-content">

            <span>
              Campanha
            </span>

            <h3>
              {campaign.title}
            </h3>

            <p>
              Beneficiário:
              {" "}
              {campaign.beneficiaryName}
            </p>

            <div className="checkout-progress">

              <div
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <div className="checkout-progress-info">

             <strong>
  {formatCurrency(
    typeof campaign.raisedAmount === "number"
      ? campaign.raisedAmount
      : Number(
          campaign.raisedAmount
            ?.replace(/[^\d]/g, "")
        ) / 100
  )}
</strong>

              <span>
                {progress.toFixed(0)}%
              </span>

            </div>

            <small>
              Meta de {campaign.goalAmount}
            </small>

            <div className="checkout-security">

              <ShieldCheck size={18} />

              Pagamento 100% seguro
            </div>

          </div>

        </aside>

      </div>


{processing && (

  <div className="checkout-processing-overlay">

    <div className="checkout-processing-card">

      <div className="checkout-processing-spinner" />

      <strong>
        Confirmando pagamento...
      </strong>

      <p>
        Aguarde enquanto finalizamos
        sua doação.
      </p>

    </div>

  </div>

)}

{showSaveCardModal && (

  <div
  className={`save-card-overlay ${
    closingSaveCardModal
      ? "closing"
      : ""
  }`}
>

  <div
    className={`save-card-modal ${
      closingSaveCardModal
        ? "closing"
        : ""
    }`}
  >

      <h3>
        Salvar cartão?
      </h3>

      <p>
        Você deseja salvar este cartão
        para pagamentos futuros?
      </p>

      <div className="save-card-actions">

        <button
          className="secondary"
          onClick={() =>
            continueCardPayment(false)
          }
        >
          Agora não
        </button>

        <button
          className="primary"
          onClick={() =>
            continueCardPayment(true)
          }
        >
          Salvar cartão
        </button>

      </div>

    </div>

  </div>

)}

    </section>
  );
}
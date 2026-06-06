import "./MonthlyCheckout.css";

import { useEffect,  useState } from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { api } from "../../services/api";

import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
} from "lucide-react";



import {
  collection,
  onSnapshot,
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

import {
  addDoc,
  serverTimestamp,
} from "firebase/firestore";



import { useToast } from "../../contexts/ToastContext";


declare global {

  interface Window {
    MercadoPago: any;
  }

}

export function MonthlyCheckout() {



const { showToast } = useToast();

  const [searchParams] =
  useSearchParams();

const [amount, setAmount] =
  useState(
    searchParams.get("amount") || ""
  );

  const navigate = useNavigate();

 

 const [step, setStep] =
  useState(2);


  
  
const [paymentMethod,
  setPaymentMethod] =
    useState("credit");

const [newCard, setNewCard] =
  useState(true);

const [savedCards, setSavedCards] =
  useState<any[]>([]);



const donationValue =
  Number(
    amount
      .replace(/\./g, "")
      .replace(",", ".")
  ) || 0;



const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [cpf, setCpf] = useState("");






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
      .VITE_MP_SUBSCRIPTION_PUBLIC_KEY
  );


const [closingSaveCardModal,
  setClosingSaveCardModal] =
    useState(false);


const [selectedCard, setSelectedCard] =
  useState<any | null>(null);


const [editingAmount,
  setEditingAmount] =
    useState(false);

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
    return "master";
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

      const cardsRef =
  collection(
    db,
    "users",
    user.uid,
    "savedCards"
  );


  onSnapshot(
    cardsRef,
    (snapshot) => {

      const cards =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setSavedCards(cards);
    }
  );

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



 


const handleCardPayment =
  async (
    shouldSaveCard: boolean
  ) => {

    try {


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

          cardExpirationMonth:
  month,

cardExpirationYear:
  `20${year}`,
        });

     
const firstSix =
  tokenResponse.first_six_digits;

console.log(
  "FIRST SIX",
  firstSix
);


const paymentMethods =
  await mp.getPaymentMethods({
    bin:
      tokenResponse.first_six_digits
  });




const subscriptionPayload = {

  user_id:
    auth.currentUser?.uid || "",

  token:
    tokenResponse.id,

  email:
    cardEmail,

  cpf:
    cardCpf.replace(/\D/g, ""),

  amount:
    donationValue,

  card_holder:
    cardHolder,
};



const response =
  await api.post(
    "/create-subscription",
    subscriptionPayload
  );


console.log(response.data);
  
  

if (
  response.data.success
) {

  if (
  shouldSaveCard &&
  auth.currentUser
) {

    


const cardAlreadyExists =
  savedCards.some(
    (card: any) =>
      card.last4 ===
        tokenResponse.last_four_digits &&
      card.brand ===
        paymentMethods.results[0]?.id
  );

  if (cardAlreadyExists) {

  showToast(
    "Este cartão já está salvo.",
    "info"
  );

} else {

  await addDoc(
    collection(
      db,
      "users",
      auth.currentUser.uid,
      "savedCards"
    ),
    {
      brand:
        paymentMethods.results[0]?.id,

      issuer:
        paymentMethods.results[0]
          ?.issuer?.name,

      issuerId:
        paymentMethods.results[0]
          ?.issuer?.id,

      last4:
        tokenResponse.last_four_digits,

      holderName:
        cardHolder,

      createdAt:
        serverTimestamp(),
    }
  );

  showToast(
    "Cartão salvo com sucesso!",
    "success"
  );
}

  }

  setTimeout(() => {

    navigate(
      "/monthly-subscription-success",
      {
        state: {
          amount: donationValue,
        },
      }
    );

  }, 2500);

} else {

  setProcessing(false);

  showToast(
    "Pagamento recusado",
    "error"
  );
}

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

 
  handleCloseSaveCardModal();

  setTimeout(() => {

   handleCardPayment(saveCard);

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
  Configure sua doação mensal
</h1>

         
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



<>

<h3>
  Formas de pagamento
</h3>

<div className="checkout-methods">


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
          Cartão recorrente
        </span>

      </button>

      

   </div>

</>






    

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


    {!newCard && (

  <div className="saved-cards-list">

    {savedCards.length === 0 ? (

      <p className="saved-cards-empty">
        Nenhum cartão salvo ainda.
      </p>

    ) : (

      savedCards.map((card) => (

        <button
  key={card.id}
  className={`saved-card-item ${
    selectedCard?.id === card.id
      ? "active"
      : ""
  }`}
  onClick={() => {

  if (
    selectedCard?.id ===
    card.id
  ) {

    setSelectedCard(null);

  } else {

    setSelectedCard(card);
  }
}}
>

         <img
  src={`/cards/${card.brand}.png`}
  alt={card.brand}
  className="saved-card-brand"
/>
          <div>

            <strong>
              {card.brand}
              {" "}
              ••••
              {" "}
              {card.last4}
            </strong>

            <span>
  Cartão salvo
</span>

          </div>

        </button>

      ))

    )}

  </div>

  

)}



    {newCard && (

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

)}

  </div>

)}


<button
  className="checkout-donate-btn"
  onClick={() =>
    setShowSaveCardModal(true)
  }
>
  Doar {formatCurrency(donationValue)}
</button>

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

  <div className="monthly-summary-card">

    <h2>
      Resumo
    </h2>

    <div className="monthly-summary-content">

      <h3>
        💚 Doação mensal
      </h3>

      <p>
        Faça uma doação mensal e
        mantenha saldo disponível
        na sua carteira Somar.
        Todo mês o valor será
        adicionado automaticamente
        e você poderá escolher
        qual campanha deseja apoiar.
      </p>

      <div className="monthly-summary-value">

  <span>
    Valor
  </span>

  {!editingAmount ? (

    <strong>
      {formatCurrency(
        donationValue
      )}
    </strong>

  ) : (

    <input
      autoFocus
      value={amount}
      onChange={handleMoneyChange}
    />

  )}

</div>
<button
  type="button"
  className={
    editingAmount
      ? "campaign-donate-button"
      : "monthly-edit-btn"
  }
  onClick={() => {

    if (!editingAmount) {

      setEditingAmount(true);

    } else {

      setEditingAmount(false);

    }

  }}
>

  {
    editingAmount
      ? "Salvar"
      : "Alterar valor"
  }

</button>

      <div className="checkout-security">

        <ShieldCheck size={18} />

        Pagamento 100% seguro

      </div>

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
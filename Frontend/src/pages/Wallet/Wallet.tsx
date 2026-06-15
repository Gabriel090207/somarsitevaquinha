import "./Wallet.css";

import {
  useEffect,
  useState,
} from "react";

import {
  doc,
  onSnapshot,
  collection,
  deleteDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../services/firebase";

import {
  Eye,
  EyeOff,
  Wallet as WalletIcon,
  Trash2,
} from "lucide-react";

import {
  useToast,
} from "../../contexts/ToastContext";

import { api }
  from "../../services/api";


import {
  Link
} from "react-router-dom";

export function Wallet() {

const { showToast } =
  useToast();

const [
  activeTab,
  setActiveTab,
] = useState<
  "monthly" |
  "cards"
>("monthly");

  const [balance, setBalance] =
  useState<number | null>(null);

  const [
  hideBalance,
  setHideBalance,
] = useState(false);


const [
  subscription,
  setSubscription,
] = useState<any>(null);

const [
  showSubscriptionModal,
  setShowSubscriptionModal,
] = useState(false);

const [
  nextSubscriptionState,
  setNextSubscriptionState,
] = useState(false);

const [
  savedCards,
  setSavedCards
] = useState<any[]>([]);

const [
  selectedCard,
  setSelectedCard
] = useState<any>(null);

const [
  showDeleteCardModal,
  setShowDeleteCardModal
] = useState(false);


const [
  closingDeleteCardModal,
  setClosingDeleteCardModal
] = useState(false);

async function handleDeleteCard() {

  const user =
    auth.currentUser;

  if (
    !user ||
    !selectedCard
  ) return;

  try {

    await deleteDoc(

      doc(
        db,
        "users",
        user.uid,
        "savedCards",
        selectedCard.id
      )

    );

    showToast(
      "Cartão removido com sucesso.",
      "success"
    );

   handleCloseDeleteCardModal();

  } catch {

    showToast(
      "Erro ao remover cartão.",
      "error"
    );

  }

}

function handleCloseDeleteCardModal() {

  setClosingDeleteCardModal(
    true
  );

  setTimeout(() => {

    setShowDeleteCardModal(
      false
    );

    setClosingDeleteCardModal(
      false
    );

    setSelectedCard(
      null
    );

  }, 250);

}

async function handleSubscriptionStatus() {

  const user =
    auth.currentUser;

  if (
    !user ||
    !subscription
  ) return;

  try {

    const response =
      await api.post(
        "/update-subscription-status",
        {

          user_id:
            user.uid,

          subscription_id:
            subscription.id,

          active:
            nextSubscriptionState,
        }
      );

    if (
      !response.data.success
    ) {

      showToast(
        "Erro ao atualizar sua doação mensal.",
        "error"
      );

      return;
    }

    showToast(
      nextSubscriptionState
        ? "Doação mensal ativada com sucesso."
        : "Doação mensal pausada com sucesso."
    );

    setShowSubscriptionModal(
      false
    );

  } catch {

    showToast(
      "Erro ao atualizar sua doação mensal.",
      "error"
    );

  }

}

useEffect(() => {

  const unsubscribeAuth =
    auth.onAuthStateChanged(
      (user) => {

        if (!user) {

          setBalance(0);

          return;
        }

        const walletRef =
          doc(
            db,
            "users",
            user.uid,
            "wallet",
            "main"
          );

        const unsubscribeWallet =
          onSnapshot(
            walletRef,
            (snapshot) => {

              if (
                snapshot.exists()
              ) {

                setBalance(
                  snapshot.data()
                    .balance || 0
                );

              } else {

                setBalance(0);

              }

            }
          );

          const subscriptionsRef =
  collection(
    db,
    "users",
    user.uid,
    "subscriptions"
  );

const unsubscribeSubscription =
  onSnapshot(
    subscriptionsRef,
    (snapshot) => {

      if (snapshot.empty) {

        setSubscription(null);

        return;
      }

      const doc =
        snapshot.docs[0];

      setSubscription({

        id: doc.id,

        ...doc.data(),

      });

    }
  );


  const cardsRef =
  collection(
    db,
    "users",
    user.uid,
    "savedCards"
  );

const unsubscribeCards =
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



        return () => {

unsubscribeCards();

  unsubscribeWallet();

  unsubscribeSubscription();

};

      }
    );

  return () =>
    unsubscribeAuth();

}, []);


  return (

    <section className="wallet">

      <div className="wallet-container">

        <h1>
          Minha carteira
        </h1>

        <div className="wallet-content">

          <aside className="wallet-sidebar">

            <div className="wallet-balance-card">

              <div className="wallet-balance-top">

                <div>

                  <span>
                    Saldo
                  </span>

                 <h2>

  {balance === null

    ? "..."

    : hideBalance

      ? "••••••"

      : balance.toLocaleString(
          "pt-BR",
          {
            style: "currency",
            currency: "BRL",
          }
        )}

</h2>

                </div>

               <button
  onClick={() =>
    setHideBalance(
      !hideBalance
    )
  }
>

  {
    hideBalance ? (

      <Eye size={24} />

    ) : (

      <EyeOff size={24} />

    )
  }

</button>

              </div>

              <div className="wallet-icon">

                <WalletIcon size={40} />

              </div>

            </div>

            <div className="wallet-menu">

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

              <button
                className={
                  activeTab ===
                  "cards"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "cards"
                  )
                }
              >

               Meus cartões

              </button>

            </div>

          </aside>

          <div className="wallet-main">

            {

              activeTab ===
              "monthly" && (

                <>

                <div className="wallet-section">

<h3>
  {
    subscription?.active
      ? "Ativa"
      : "Inativa"
  }
</h3>

  {

    subscription ? (

      <div
  className={`subscription-card ${
    subscription?.active
      ? "active"
      : "inactive"
  }`}
>

        <div>

  <strong>

    {subscription.amount.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    )}

    / mês

  </strong>

  <Link
    to="/editar-doacao-mensal"
    className="subscription-edit"
  >

    Alterar valor

  </Link>

</div>

        <button
  className={`subscription-switch ${
    subscription.active
      ? "active"
      : ""
  }`}
  onClick={() => {

    setNextSubscriptionState(
      !subscription.active
    );

    setShowSubscriptionModal(
      true
    );

  }}
>

  <span />

</button>

      </div>

    ) : (

      <p>
        Você não possui
        uma doação mensal.
      </p>

    )

  }

</div>


               

                </>

              )

            }

            {

              activeTab ===
              "cards" && (

               <div className="wallet-section">

  <h3>
    Meus cartões
  </h3>

  {

  savedCards.length === 0 ? (

  <p>
    Nenhum cartão salvo.
  </p>

) : (

  <div className="wallet-cards-list">

    {savedCards.map((card) => (

      <div
        key={card.id}
        className="wallet-card-item"
      >

        <div className="wallet-card-left">

          <img
            src={`/cards/${card.brand}.png`}
            alt={card.brand}
            className="wallet-card-brand"
          />

          <div className="wallet-card-info">

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

        </div>

        <button
          className="wallet-card-delete"
          onClick={() => {

            setSelectedCard(card);

            setShowDeleteCardModal(
              true
            );

          }}
        >

          <Trash2 size={22} />

        </button>

      </div>

    ))}

  </div>

)

  }

</div>

              )

            }

          </div>

        </div>

      </div>


{
  showDeleteCardModal && (

   <div
  className={`delete-modal-overlay ${
    closingDeleteCardModal
      ? "closing"
      : ""
  }`}
>

      <div
  className={`delete-modal ${
    closingDeleteCardModal
      ? "closing"
      : ""
  }`}
>

        <h3>
          Remover cartão?
        </h3>

        <p>

          Este cartão será removido
          dos seus cartões salvos.

        </p>

        <div className="delete-modal-actions">

          <button
            className="cancel"
            onClick={
  handleCloseDeleteCardModal
}
          >

            Cancelar

          </button>

          <button
            className="walletdelete"
            onClick={
              handleDeleteCard
            }
          >

            Remover

          </button>

        </div>

      </div>

    </div>

  )
}


{
  showSubscriptionModal && (

    <div className="delete-modal-overlay">

      <div className="delete-modal">

        <h3>

          {
            subscription?.active
              ? "Pausar doação mensal?"
              : "Ativar doação mensal?"
          }

        </h3>

        <p>

          {
            subscription?.active

              ? "Sua doação mensal será pausada até que você a ative novamente."

              : "Sua doação mensal voltará a ser cobrada normalmente."
          }

        </p>

        <div className="delete-modal-actions">

          <button
            className="cancel"
            onClick={() =>
              setShowSubscriptionModal(
                false
              )
            }
          >

            Cancelar

          </button>

         <button
  className="primary"
  onClick={
    handleSubscriptionStatus
  }
>
  Confirmar
</button>

        </div>

      </div>

    </div>

  )
}

    </section>

  );
}
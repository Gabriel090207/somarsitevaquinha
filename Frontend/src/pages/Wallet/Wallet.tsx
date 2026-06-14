import "./Wallet.css";

import {
  useEffect,
  useState,
} from "react";

import {
  doc,
  onSnapshot,
  collection,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../services/firebase";

import {
  Eye,
  EyeOff,
  Wallet as WalletIcon,
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
  ] = useState("monthly");

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



        return () => {

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
                  "customization"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "customization"
                  )
                }
              >

                Personalização

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
              "customization" && (

                <div className="wallet-section">

                  <h3>
                    Personalização
                  </h3>

                  <p>
                    Nenhuma opção
                    disponível no momento.
                  </p>

                </div>

              )

            }

          </div>

        </div>

      </div>


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
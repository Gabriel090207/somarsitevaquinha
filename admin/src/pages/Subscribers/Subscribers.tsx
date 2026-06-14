import "./Subscribers.css";

import {
  useEffect,
  useState,
} from "react";

import {
  collectionGroup,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

import {
  Search,
} from "lucide-react";

import { db }
  from "../../services/firebase";

import { Sidebar }
  from "../../components/Sidebar/Sidebar";

type Subscriber = {
  id: string;

  name: string;

  email: string;

  amount: number;

  status: string;

  next_payment_date?: string;

  createdAt?: any;
};

export function Subscribers() {

  const [subscribers, setSubscribers] =
    useState<Subscriber[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

  const unsubscribe =
    onSnapshot(

      collectionGroup(
        db,
        "subscriptions"
      ),

      async (snapshot) => {

        const subscriptions =
          snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        const subscribersWithUsers =
          await Promise.all(

            subscriptions.map(
              async (subscription: any) => {

                const usersQuery =
                  query(
                    collection(
                      db,
                      "users"
                    ),
                    where(
                      "email",
                      "==",
                      subscription.email
                    )
                  );

                const usersSnapshot =
                  await getDocs(
                    usersQuery
                  );

                const userData =
                  usersSnapshot.docs[0]
                    ?.data();

                return {

                  ...subscription,

                  name:
                    userData?.name ||
                    subscription.email,

                };

              }
            )

          );

        setSubscribers(
          subscribersWithUsers as Subscriber[]
        );

        setLoading(false);

      }

    );

  return () =>
    unsubscribe();

}, []);

  const filteredSubscribers =
    subscribers.filter(
      (subscriber) =>
        subscriber.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        subscriber.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

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

    <main className="subscribers-page">

      <Sidebar />

      <section className="subscribers-content">

        <div className="subscribers-header">

          <div>

            <span>
              Assinaturas
            </span>

            <h1>
              Assinantes
            </h1>

          </div>

        </div>

        <div className="subscribers-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar assinante..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

        {loading ? (

  <p>
    Carregando assinantes...
  </p>

) : filteredSubscribers.length === 0 ? (

  <p>
    Nenhum assinante encontrado.
  </p>

) : (

          <div className="subscribers-list">

            {filteredSubscribers.map(
              (subscriber) => (

               <div
  key={subscriber.id}
  className="subscriber-item"
>

  <div className="subscriber-user">

   <div className="subscriber-avatar">

  {subscriber.name
    ?.charAt(0)
    ?.toUpperCase()}

</div>

    <div>

   <strong>
  {subscriber.name?.toUpperCase()}
</strong>

      <p>
        {subscriber.email}
      </p>

    </div>

  </div>

  <div
    className={`subscriber-status ${
      subscriber.status?.toLowerCase()
    }`}
  >

    {subscriber.status ===
    "authorized"
      ? "Ativa"
      : "Inativa"}

  </div>

  <div className="subscriber-amount">

    <strong>

      {formatMoney(
  subscriber.amount
)}

    </strong>

  </div>

  <div className="subscriber-next">

    <strong>
      Próxima cobrança
    </strong>

    <span>

      {subscriber.next_payment_date
        ? new Date(
            subscriber.next_payment_date
          ).toLocaleDateString(
            "pt-BR"
          )
        : "-"}

    </span>

  </div>

</div>

              )
            )}

          </div>

        )}

      </section>

    </main>

  );
}
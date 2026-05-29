import "./Subscribers.css";

import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db }
  from "../../services/firebase";

import { Sidebar }
  from "../../components/Sidebar/Sidebar";

type Subscriber = {
  id: string;

  name: string;

  email: string;

  amount: number;

  createdAt: any;

  status: string;
};

export function Subscribers() {

  const [subscribers, setSubscribers] =
    useState<Subscriber[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const subscribersRef =
      collection(
        db,
        "monthlyDonations"
      );

    const unsubscribe =
      onSnapshot(
        subscribersRef,
        (snapshot) => {

          const data =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            ) as Subscriber[];

          setSubscribers(data);

          setLoading(false);
        }
      );

    return () =>
      unsubscribe();

  }, []);

  return (

    <main className="subscribers-page">

      <Sidebar />

      <section className="subscribers-content">

        <div className="subscribers-header">

          <span>
            Assinaturas
          </span>

          <h1>
            Assinantes
          </h1>

        </div>

        {loading ? (

          <p>
            Carregando...
          </p>

        ) : subscribers.length === 0 ? (

          <div className="subscribers-empty">

            Nenhum assinante encontrado.

          </div>

        ) : (

          <div className="subscribers-list">

            {subscribers.map(
              (subscriber) => (

                <div
                  key={subscriber.id}
                  className="subscriber-item"
                >

                  <strong>
                    {subscriber.name}
                  </strong>

                  <p>
                    {subscriber.email}
                  </p>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </main>

  );
}
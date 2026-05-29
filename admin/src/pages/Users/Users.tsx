import "./Users.css";

import {
  useEffect,
  useState,
} from "react";

import { Sidebar }
  from "../../components/Sidebar/Sidebar";

import {
  Search,
  MoreVertical,
} from "lucide-react";

import {
  collection,
 onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db }
  from "../../services/firebase";

type User = {
  id: string;

  name: string;

  email: string;

  role: string;
};

export function Users() {

  const [users, setUsers] =
    useState<User[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

 useEffect(() => {

  const usersRef =
    collection(db, "users");

  const q =
    query(
      usersRef,
      where("role", "==", "user")
    );

  const unsubscribe =
    onSnapshot(
      q,
      (snapshot) => {

        const usersData =
          snapshot.docs.map((doc) => ({

            id: doc.id,

            ...doc.data(),

          })) as User[];

        setUsers(usersData);

        setLoading(false);
      }
    );

  return () => unsubscribe();

}, []);

  const filteredUsers =
    users.filter((user) =>
      user.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <main className="users-page">

      <Sidebar />

      <section className="users-content">

        {/* HEADER */}

        <div className="users-header">

          <div>

            <span>
              Gerenciamento
            </span>

            <h1>
              Usuários
            </h1>

          </div>

        </div>

        {/* SEARCH */}

        <div className="users-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar usuário..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        {/* LIST */}

        <div className="users-list">

          {loading ? (

            <p>
              Carregando usuários...
            </p>

          ) : filteredUsers.length === 0 ? (

            <p>
              Nenhum usuário encontrado.
            </p>

          ) : (

            filteredUsers.map((user) => (

              <div
                className="user-item"
                key={user.id}
              >

                <div className="user-left">

                  <div className="user-avatar">

                    {user.name?.charAt(0)}

                  </div>

                  <div>

                    <strong>
                      {user.name}
                    </strong>

                    <p>
                      {user.email}
                    </p>

                  </div>

                </div>

                <button className="user-menu">

                  <MoreVertical size={18} />

                </button>

              </div>

            ))

          )}

        </div>

      </section>

    </main>

  );
}
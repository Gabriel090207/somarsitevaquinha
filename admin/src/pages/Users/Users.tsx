import "./Users.css";

import {
  useEffect,
  useState,
} from "react";

import { Sidebar }
  from "../../components/Sidebar/Sidebar";

import {
  Search,
  Trash2,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db }
  from "../../services/firebase";


import { useToast }
  from "../../contexts/ToastContext";

type User = {
  id: string;

  name: string;

  email: string;

  role: string;
};

export function Users() {


  const { showToast } =
  useToast();

  const [users, setUsers] =
    useState<User[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);


const [showDeleteModal, setShowDeleteModal] =
  useState(false);

const [closingModal, setClosingModal] =
  useState(false);

const [selectedUser, setSelectedUser] =
  useState<User | null>(null);


function handleOpenDeleteModal(
  user: User
) {

  setSelectedUser(
    user
  );

  setShowDeleteModal(true);

}

function handleCloseModal() {

  setClosingModal(true);

  setTimeout(() => {

    setShowDeleteModal(false);

    setClosingModal(false);

    setSelectedUser(null);

  }, 250);

}

async function handleDeleteUser() {

  if (!selectedUser) {
    return;
  }

  try {

  await deleteDoc(
    doc(
      db,
      "users",
      selectedUser.id
    )
  );

  setUsers((prev) =>
    prev.filter(
      (user) =>
        user.id !==
        selectedUser.id
    )
  );

  showToast(
    "Usuário removido com sucesso.",
    "success"
  );

} catch (error) {

  console.log(error);

  showToast(
    "Erro ao remover usuário.",
    "error"
  );

} finally {

  handleCloseModal();

}

}


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

                <button
  className="user-delete"
  onClick={() =>
    handleOpenDeleteModal(
      user
    )
  }
>

  <Trash2 size={18} />

</button>

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
        Excluir usuário
      </h3>

      <p>

        Tem certeza que deseja
        excluir este usuário?

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
            handleDeleteUser
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
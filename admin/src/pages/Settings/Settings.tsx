import "./Settings.css";

import {
  useEffect,
  useState,
} from "react";

import { Sidebar }
  from "../../components/Sidebar/Sidebar";

import {
  ShieldCheck,
  UserPlus,
  Building2,
  Globe,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import { db }
  from "../../services/firebase";

import { api }
  from "../../services/api";

import { useToast }
  from "../../contexts/ToastContext";

type AdminUser = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  role: string;
};

export function Settings() {

  const { showToast } =
    useToast();


    function formatCpf(value: string) {

  return value
    .replace(/\D/g, "")
    .slice(0, 11)
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
}

function formatPhone(
  value: string
) {

  const numbers =
    value
      .replace(/\D/g, "")
      .slice(0, 11);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
}

  const [activeTab, setActiveTab] =
    useState("admins");

  const [admins, setAdmins] =
    useState<AdminUser[]>([]);

  const [editingAdmin, setEditingAdmin] =
    useState<AdminUser | null>(null);

  const [adminName, setAdminName] =
    useState("");

  const [adminCpf, setAdminCpf] =
    useState("");

  const [adminEmail, setAdminEmail] =
    useState("");

  const [adminPhone, setAdminPhone] =
    useState("");

  const [adminPassword, setAdminPassword] =
    useState("");

  const [platform, setPlatform] =
  useState({
    name: "",
    email: "",
    website: "",
  });

 const [social, setSocial] =
  useState({
    instagram: "",
    facebook: "",
    whatsapp: "",
    youtube: "",
  });

  const [selectedAdmin, setSelectedAdmin] =
    useState<AdminUser | null>(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [closingModal, setClosingModal] =
    useState(false);

  useEffect(() => {

    const q = query(
      collection(db, "users"),
      where("role", "==", "admin")
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as AdminUser[];

        setAdmins(data);

      });

    return () => unsubscribe();

  }, []);

  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        doc(db, "settings", "platform"),
        (snapshot) => {

          if (snapshot.exists()) {

            setPlatform({
  name: snapshot.data().name || "",
  email: snapshot.data().email || "",
  website: snapshot.data().website || "",
});

          }

        }
      );

    return () => unsubscribe();

  }, []);

  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        doc(db, "settings", "social"),
        (snapshot) => {

          if (snapshot.exists()) {

            setSocial({
  instagram: snapshot.data().instagram || "",
  facebook: snapshot.data().facebook || "",
  whatsapp: snapshot.data().whatsapp || "",
  youtube: snapshot.data().youtube || "",
});

          }

        }
      );

    return () => unsubscribe();

  }, []);

  function resetAdminForm() {

    setEditingAdmin(null);
    setAdminName("");
    setAdminCpf("");
    setAdminEmail("");
    setAdminPhone("");
    setAdminPassword("");

  }

  function handleEditAdmin(
    admin: AdminUser
  ) {

    setEditingAdmin(admin);

    setAdminName(admin.name || "");
    setAdminCpf(admin.cpf || "");
    setAdminEmail(admin.email || "");
    setAdminPhone(admin.phone || "");
    setAdminPassword("");

    setActiveTab("createAdmin");

  }

  async function handleSaveAdmin() {

    try {

      if (editingAdmin) {

        await updateDoc(
          doc(db, "users", editingAdmin.id),
          {
            name: adminName,
            cpf: adminCpf,
            email: adminEmail,
            phone: adminPhone,
            role: "admin",
          }
        );

        showToast(
          "Administrador atualizado com sucesso.",
          "success"
        );

        resetAdminForm();

        setActiveTab("admins");

        return;
      }

      await api.post(
        "/create-admin",
        {
          name: adminName,
          cpf: adminCpf,
          email: adminEmail,
          phone: adminPhone,
          password: adminPassword,
          role: "admin",
        }
      );

      showToast(
        "Administrador criado com sucesso.",
        "success"
      );

      resetAdminForm();

      setActiveTab("admins");

    } catch (error) {

      console.log(error);

      showToast(
        editingAdmin
          ? "Erro ao atualizar administrador."
          : "Erro ao criar administrador.",
        "error"
      );

    }

  }

  function handleOpenDeleteModal(
    admin: AdminUser
  ) {

    setSelectedAdmin(admin);

    setShowDeleteModal(true);

  }

  function handleCloseModal() {

    setClosingModal(true);

    setTimeout(() => {

      setShowDeleteModal(false);

      setClosingModal(false);

      setSelectedAdmin(null);

    }, 250);

  }

  async function handleDeleteAdmin() {

    if (!selectedAdmin) return;

    try {

      await api.delete(
  `/delete-admin/${selectedAdmin.id}`
);

      showToast(
        "Administrador removido com sucesso.",
        "success"
      );

    } catch (error) {

      console.log(error);

      showToast(
        "Erro ao remover administrador.",
        "error"
      );

    } finally {

      handleCloseModal();

    }

  }

  async function handleSavePlatform() {

    try {

      await setDoc(
        doc(db, "settings", "platform"),
        platform,
        {
          merge: true,
        }
      );

      showToast(
        "Informações da plataforma salvas com sucesso.",
        "success"
      );

    } catch (error) {

      console.log(error);

      showToast(
        "Erro ao salvar informações.",
        "error"
      );

    }

  }

  async function handleSaveSocial() {

    try {

      await setDoc(
        doc(db, "settings", "social"),
        social,
        {
          merge: true,
        }
      );

      showToast(
        "Redes sociais salvas com sucesso.",
        "success"
      );

    } catch (error) {

      console.log(error);

      showToast(
        "Erro ao salvar redes sociais.",
        "error"
      );

    }

  }

  return (

    <main className="settings-page">

      <Sidebar />

      <section className="settings-content">

        <div className="settings-header">

          <div>

            <span>
              Plataforma
            </span>

            <h1>
              Configurações
            </h1>

          </div>

        </div>

        <div className="settings-tabs">

          <button
            className={
              activeTab === "admins"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("admins")
            }
          >

            <div className="settings-tab-icon">
              <ShieldCheck size={24} />
            </div>

            <div>
              <strong>
                Administradores
              </strong>

              <span>
                Gerencie acessos
              </span>
            </div>

          </button>

          <button
            className={
              activeTab === "createAdmin"
                ? "active"
                : ""
            }
            onClick={() => {

              resetAdminForm();

              setActiveTab("createAdmin");

            }}
          >

            <div className="settings-tab-icon">
              <UserPlus size={24} />
            </div>

            <div>
              <strong>
                Criar admin
              </strong>

              <span>
                Novo acesso
              </span>
            </div>

          </button>

          <button
            className={
              activeTab === "platform"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("platform")
            }
          >

            <div className="settings-tab-icon">
              <Building2 size={24} />
            </div>

            <div>
              <strong>
                Plataforma
              </strong>

              <span>
                Dados gerais
              </span>
            </div>

          </button>

          <button
            className={
              activeTab === "social"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("social")
            }
          >

            <div className="settings-tab-icon">
              <Globe size={24} />
            </div>

            <div>
              <strong>
                Redes sociais
              </strong>

              <span>
                Links públicos
              </span>
            </div>

          </button>

        </div>

        <div className="settings-panel">

          {activeTab === "admins" && (

            <>

              <div className="settings-panel-header">

                <div>

                  <span>
                    Equipe
                  </span>

                  <h2>
                    Administradores
                  </h2>

                </div>

              </div>

              <div className="admin-list">

                {admins.length === 0 ? (

                  <p>
                    Nenhum administrador encontrado.
                  </p>

                ) : (

                  admins.map((admin) => (

                    <div
                      key={admin.id}
                      className="admin-item"
                    >

                      <div className="admin-user">

                        <div className="admin-avatar">

                          {admin.name
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>

                        <div>

                          <strong>
                            {admin.name}
                          </strong>

                          <p>
                            {admin.email}
                          </p>

                        </div>

                      </div>

                      <span className="admin-phone">
                        {admin.phone || "-"}
                      </span>

                      <div className="admin-actions">

                        <button
                          className="edit"
                          onClick={() =>
                            handleEditAdmin(admin)
                          }
                        >

                          <Pencil size={18} />

                        </button>

                        <button
                          className="delete"
                          onClick={() =>
                            handleOpenDeleteModal(admin)
                          }
                        >

                          <Trash2 size={18} />

                        </button>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </>

          )}

          {activeTab === "createAdmin" && (

            <>

              <div className="settings-panel-header">

                <div>

                  <span>
                    Acesso
                  </span>

                  <h2>
                    {editingAdmin
                      ? "Editar administrador"
                      : "Criar administrador"}
                  </h2>

                </div>

              </div>

              <div className="settings-form">

                <div className="settings-field">

                  <label>
                    Nome completo
                  </label>

                  <input
                    type="text"
                    value={adminName}
                    onChange={(event) =>
                      setAdminName(
                        event.target.value
                      )
                    }
                  />

                </div>

                <div className="settings-row">

                  <div className="settings-field">

                    <label>
                      CPF
                    </label>

                    <input
                      type="text"
                      value={adminCpf}
                      onChange={(event) =>
  setAdminCpf(
    formatCpf(
      event.target.value
    )
  )
}
                    />

                  </div>

                  <div className="settings-field">

                    <label>
                      Telefone
                    </label>

                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(event) =>
  setAdminPhone(
    formatPhone(
      event.target.value
    )
  )
}
                    />

                  </div>

                </div>

                <div className="settings-field">

                  <label>
                    E-mail
                  </label>

                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(event) =>
                      setAdminEmail(
                        event.target.value
                      )
                    }
                  />

                </div>

                {!editingAdmin && (

                  <div className="settings-field">

                    <label>
                      Senha
                    </label>

                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(event) =>
                        setAdminPassword(
                          event.target.value
                        )
                      }
                    />

                  </div>

                )}

                <button
                  className="settings-save"
                  onClick={handleSaveAdmin}
                >

                  <Save size={18} />

                  {editingAdmin
                    ? "Salvar alterações"
                    : "Criar administrador"}

                </button>

              </div>

            </>

          )}

          {activeTab === "platform" && (

            <>

              <div className="settings-panel-header">

                <div>

                  <span>
                    Dados públicos
                  </span>

                  <h2>
                    Plataforma
                  </h2>

                </div>

              </div>

              <div className="settings-form">

               <div className="settings-row">

  <div className="settings-field">

    <label>
      Nome da Plataforma
    </label>

    <input
      type="text"
      value={platform.name}
      onChange={(event) =>
        setPlatform({
          ...platform,
          name: event.target.value,
        })
      }
    />

  </div>

  <div className="settings-field">

    <label>
      E-mail
    </label>

    <input
      type="email"
      value={platform.email}
      onChange={(event) =>
        setPlatform({
          ...platform,
          email: event.target.value,
        })
      }
    />

  </div>

</div>

<div className="settings-field">

  <label>
    Website
  </label>

  <input
    type="text"
    value={platform.website}
    onChange={(event) =>
      setPlatform({
        ...platform,
        website: event.target.value,
      })
    }
  />

</div>

                <button
                  className="settings-save"
                  onClick={handleSavePlatform}
                >

                  <Save size={18} />

                  Salvar plataforma

                </button>

              </div>

            </>

          )}

          {activeTab === "social" && (

            <>

              <div className="settings-panel-header">

                <div>

                  <span>
                    Links
                  </span>

                  <h2>
                    Redes sociais
                  </h2>

                </div>

              </div>

              <div className="settings-form">

              <div className="settings-row">

  <div className="settings-field">

    <label>
      Instagram
    </label>

    <input
      type="text"
      value={social.instagram}
      onChange={(event) =>
        setSocial({
          ...social,
          instagram: event.target.value,
        })
      }
    />

  </div>

  <div className="settings-field">

    <label>
      Facebook
    </label>

    <input
      type="text"
      value={social.facebook}
      onChange={(event) =>
        setSocial({
          ...social,
          facebook: event.target.value,
        })
      }
    />

  </div>

</div>

<div className="settings-row">

  <div className="settings-field">

    <label>
      WhatsApp
    </label>

    <input
      type="text"
      value={social.whatsapp}
      onChange={(event) =>
        setSocial({
          ...social,
          whatsapp: event.target.value,
        })
      }
    />

  </div>

  <div className="settings-field">

    <label>
      YouTube
    </label>

    <input
      type="text"
      value={social.youtube}
      onChange={(event) =>
        setSocial({
          ...social,
          youtube: event.target.value,
        })
      }
    />

  </div>

</div>

                <button
                  className="settings-save"
                  onClick={handleSaveSocial}
                >

                  <Save size={18} />

                  Salvar redes sociais

                </button>

              </div>

            </>

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
              Excluir administrador
            </h3>

            <p>
              Tem certeza que deseja excluir este administrador?
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
                onClick={handleDeleteAdmin}
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
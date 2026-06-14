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
  deleteDoc,
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
      phone: "",
      whatsapp: "",
      address: "",
    });

  const [social, setSocial] =
    useState({
      instagram: "",
      facebook: "",
      youtube: "",
      tiktok: "",
      linkedin: "",
      website: "",
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
              phone: snapshot.data().phone || "",
              whatsapp: snapshot.data().whatsapp || "",
              address: snapshot.data().address || "",
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
              youtube: snapshot.data().youtube || "",
              tiktok: snapshot.data().tiktok || "",
              linkedin: snapshot.data().linkedin || "",
              website: snapshot.data().website || "",
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

      await deleteDoc(
        doc(db, "users", selectedAdmin.id)
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
                          event.target.value
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
                          event.target.value
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

                {Object.entries(platform).map(
                  ([key, value]) => (

                    <div
                      key={key}
                      className="settings-field"
                    >

                      <label>
                        {key}
                      </label>

                      <input
                        type="text"
                        value={value}
                        onChange={(event) =>
                          setPlatform({
                            ...platform,
                            [key]:
                              event.target.value,
                          })
                        }
                      />

                    </div>

                  )
                )}

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

                {Object.entries(social).map(
                  ([key, value]) => (

                    <div
                      key={key}
                      className="settings-field"
                    >

                      <label>
                        {key}
                      </label>

                      <input
                        type="text"
                        value={value}
                        onChange={(event) =>
                          setSocial({
                            ...social,
                            [key]:
                              event.target.value,
                          })
                        }
                      />

                    </div>

                  )
                )}

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
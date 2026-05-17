import "./Profile.css";

import {
  useEffect,
  useState,
} from "react";

import {
  User,
  Mail,
  Phone,
  CreditCard,
  Building2,
} from "lucide-react";

import {
  useAuth,
} from "../../contexts/AuthContext";

import {
  useToast,
} from "../../contexts/ToastContext";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../services/firebase";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";


export function Profile() {


    const [activeTab,
  setActiveTab] =
    useState("profile");

  const {
    user,
    userData,
  } = useAuth();

  const { showToast } =
    useToast();

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [cpf, setCpf] =
    useState("");

  const [cnpj, setCnpj] =
    useState("");


const [saving, setSaving] =
  useState(false);


  const [currentPassword,
  setCurrentPassword] =
    useState("");

const [newPassword,
  setNewPassword] =
    useState("");

const [confirmPassword,
  setConfirmPassword] =
    useState("");

const [updatingPassword,
  setUpdatingPassword] =
    useState(false);

  useEffect(() => {

    if (userData) {

      setName(
        userData.name || ""
      );

      setPhone(
        userData.phone || ""
      );

      setCpf(
  userData?.cpf ?? ""
);

setCnpj(
  userData?.cnpj ?? ""
);
    }

  }, [userData]);

 async function handleUpdateProfile() {

  if (!user) return;

  try {

    setSaving(true);

    await updateDoc(

      doc(
        db,
        "users",
        user.uid
      ),

      {
        name,
        phone,
        cpf,
        cnpj,
      }
    );

    showToast(
      "Perfil atualizado com sucesso!"
    );

  } catch {

    showToast(
      "Erro ao atualizar perfil.",
      "error"
    );

  } finally {

    setSaving(false);
  }
}


async function handleUpdatePassword() {

  if (!user || !user.email)
    return;

  if (
    newPassword !==
    confirmPassword
  ) {

    showToast(
      "As senhas não coincidem.",
      "error"
    );

    return;
  }

  if (
    newPassword.length < 6
  ) {

    showToast(
      "A senha deve ter no mínimo 6 caracteres.",
      "error"
    );

    return;
  }

  try {

    setUpdatingPassword(true);

    const credential =
      EmailAuthProvider.credential(

        user.email,

        currentPassword
      );

    await reauthenticateWithCredential(
      user,
      credential
    );

    await updatePassword(
      user,
      newPassword
    );

    showToast(
      "Senha atualizada com sucesso!"
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

  } catch {

    showToast(
      "Senha atual inválida.",
      "error"
    );

  } finally {

    setUpdatingPassword(false);
  }
}

  return (

    <main className="profile-page">

      <section className="profile-container">

        <aside className="profile-sidebar">

          <div className="profile-avatar">

            <div className="profile-avatar-circle">

              <User size={52} />

            </div>

            <h2>

              {
                userData?.name
                  ?.split(" ")[0]
              }

            </h2>

            <span>
              Conta Somar
            </span>

          </div>

          <nav className="profile-menu">

  <button
    className={
      activeTab === "profile"
        ? "active"
        : ""
    }
    onClick={() =>
      setActiveTab("profile")
    }
  >

    Informações pessoais

  </button>

  <button
    className={
      activeTab === "security"
        ? "active"
        : ""
    }
    onClick={() =>
      setActiveTab("security")
    }
  >

    Segurança

  </button>

  <button
    className={
      activeTab === "settings"
        ? "active"
        : ""
    }
    onClick={() =>
      setActiveTab("settings")
    }
  >

    Configurações

  </button>

</nav>

        </aside>

        <div className="profile-content">

          <div className="profile-top">

            <h1>
              Meu perfil
            </h1>

            <p>
              Gerencie suas informações pessoais.
            </p>

          </div>

          {

  activeTab ===
  "profile" && (


          <form
            className="profile-form"
            onSubmit={(e) => {

              e.preventDefault();

              handleUpdateProfile();
            }}
          >

            <div className="profile-input-group">

              <label>

                <User size={18} />

                Nome completo

              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="profile-input-group">

              <label>

                <Mail size={18} />

                E-mail

              </label>

              <input
                type="email"
                value={
                  userData?.email || ""
                }
                disabled
              />

            </div>

            <div className="profile-input-group">

              <label>

                <Phone size={18} />

                Telefone

              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="profile-input-group">

              <label>

                <CreditCard size={18} />

                {

                  userData?.type ===
                  "company"

                    ? "CNPJ"

                    : "CPF"

                }

              </label>

              <input
                type="text"

                value={
  userData?.type ===
  "company"

    ? (cnpj || "")
    : (cpf || "")
}

                onChange={(e) =>

                  userData?.type ===
                  "company"

                    ? setCnpj(
                        e.target.value
                      )

                    : setCpf(
                        e.target.value
                      )
                }
              />

            </div>

            <div className="profile-input-group">

              <label>

                <Building2 size={18} />

                Tipo da conta

              </label>

              <input
                type="text"
                value={

                  userData?.type ===
                  "company"

                    ? "Empresa"

                    : "Pessoa física"

                }
                disabled
              />

            </div>

           

            <button
  type="submit"
  className="profile-save-button"
  disabled={saving}
>

  {

    saving

      ? "Salvando..."

      : "Salvar alterações"

  }

</button>

          </form>


)

}

{

  activeTab ===
  "security" && (

    <div className="security-section">

      <h3>
        Alterar senha
      </h3>

      <p>
        Atualize sua senha para manter sua conta segura.
      </p>

      <form
        className="security-form"
        onSubmit={(e) => {

          e.preventDefault();

          handleUpdatePassword();
        }}
      >

        <div className="profile-input-group">

          <label>
            Senha atual
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(
                e.target.value
              )
            }
          />

        </div>

        <div className="profile-input-group">

          <label>
            Nova senha
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
          />

        </div>

        <div className="profile-input-group">

          <label>
            Confirmar senha
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />

        </div>

        <button
          type="submit"
          className="profile-save-button"
          disabled={
            updatingPassword
          }
        >

          {

            updatingPassword

              ? "Atualizando..."

              : "Atualizar senha"

          }

        </button>

      </form>

      <div className="security-divider" />

      <h3>
        Recuperação de conta
      </h3>

      <p>
        Envie um email para redefinir sua senha.
      </p>

      <button
        className="reset-password-button"
        onClick={async () => {

          if (!user?.email)
            return;

          await sendPasswordResetEmail(
            auth,
            user.email
          );

          showToast(
            "Email de recuperação enviado!"
          );
        }}
      >

        Enviar email de recuperação

      </button>

    </div>

  )

}

        </div>

      </section>

    </main>

  );
}
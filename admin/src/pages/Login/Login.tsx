import "./Login.css";

import bgImage
  from "../../assets/login-bg.jpg";

import { useState } from "react";

import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  useNavigate,
} from "react-router-dom";

import {
  auth,
  db,
} from "../../services/firebase";

import { useToast }
 from "../../contexts/ToastContext";


import {
  Eye,
  EyeOff,
} from "lucide-react";

export function Login() {


const [showPassword, setShowPassword] =
  useState(false);

  const navigate = useNavigate();

  const { showToast } = useToast();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    event: React.FormEvent
  ) {

    event.preventDefault();

    if (!email || !password) {
      showToast(
        "E-mail ou senha inválidos.",
        "error"
      );

      return;
    }

    try {

      setLoading(true);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      const userDoc =
        await getDoc(
          doc(db, "users", user.uid)
        );

      const userData =
        userDoc.data();

      if (
        !userDoc.exists() ||
        userData?.role !== "admin"
      ) {

        await signOut(auth);

        showToast(
          "E-mail ou senha inválidos.",
          "error"
        );

        return;
      }

      showToast(
        "Login realizado com sucesso!",
        "success"
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      showToast(
        "E-mail ou senha inválidos.",
        "error"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <main
      className="login-page"
      style={{
        backgroundImage:
          `url(${bgImage})`,
      }}
    >

      <div className="login-overlay"></div>

      <div className="login-container">

        <section className="login-left">

          <span className="login-hero-badge">
            Painel Administrativo
          </span>

          <h1>
            Gerencie histórias.
            <br />

            <span>
              Transforme impactos.
            </span>
          </h1>

          <p>
            Área administrativa da Somar
            para gerenciamento de campanhas,
            usuários, doações e toda a
            plataforma.
          </p>

        </section>

        <section className="login-right">

          <div className="login-card">

            <span className="login-badge">
              Acesso restrito à equipe Somar
            </span>

            <h2>
              Entrar
            </h2>

            <p>
              Faça login para acessar
              o painel da plataforma.
            </p>

            <form onSubmit={handleLogin}>

              <div className="login-field">

                <label>
                  E-mail
                </label>

                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />

              </div>

              <div className="login-field">

  <label>
    Senha
  </label>

  <div className="login-password">

    <input
      type={
        showPassword
          ? "text"
          : "password"
      }
      placeholder="Digite sua senha"
      value={password}
      onChange={(event) =>
        setPassword(
          event.target.value
        )
      }
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() =>
        setShowPassword(
          !showPassword
        )
      }
    >

      {showPassword ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}

    </button>

  </div>

</div>
              <button
                type="submit"
                disabled={loading}
              >
                {
                  loading
                    ? "Entrando..."
                    : "Entrar"
                }
              </button>

            </form>

          </div>

        </section>

      </div>

    </main>
  );
}
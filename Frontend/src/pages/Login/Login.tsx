import "./Login.css";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import { useToast } from "../../contexts/ToastContext";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  auth,
  db,
} from "../../services/firebase";

import {
  doc,
  setDoc,
} from "firebase/firestore";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

function formatCPF(value: string) {

  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .slice(0, 14);
}

function formatPhone(value: string) {

  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

function formatCNPJ(value: string) {

  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}


function validateCPF(cpf: string) {

  const cleaned =
    cpf.replace(/\D/g, "");

  if (cleaned.length !== 11)
    return false;

  if (/^(\d)\1+$/.test(cleaned))
    return false;

  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += Number(cleaned[i]) * (10 - i);
  }

  let firstDigit =
    (sum * 10) % 11;

  if (firstDigit === 10)
    firstDigit = 0;

  if (
    firstDigit !== Number(cleaned[9])
  )
    return false;

  sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += Number(cleaned[i]) * (11 - i);
  }

  let secondDigit =
    (sum * 10) % 11;

  if (secondDigit === 10)
    secondDigit = 0;

  return (
    secondDigit === Number(cleaned[10])
  );
}

function validateCNPJ(cnpj: string) {

  const cleaned =
    cnpj.replace(/\D/g, "");

  if (cleaned.length !== 14)
    return false;

  if (/^(\d)\1+$/.test(cleaned))
    return false;

  let size =
    cleaned.length - 2;

  let numbers =
    cleaned.substring(0, size);

  const digits =
    cleaned.substring(size);

  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {

    sum +=
      Number(numbers[size - i]) * pos--;

    if (pos < 2)
      pos = 9;
  }

  let result =
    sum % 11 < 2
      ? 0
      : 11 - (sum % 11);

  if (result !== Number(digits[0]))
    return false;

  size += 1;

  numbers =
    cleaned.substring(0, size);

  sum = 0;

  pos = size - 7;

  for (let i = size; i >= 1; i--) {

    sum +=
      Number(numbers[size - i]) * pos--;

    if (pos < 2)
      pos = 9;
  }

  result =
    sum % 11 < 2
      ? 0
      : 11 - (sum % 11);

  return (
    result === Number(digits[1])
  );
}

import authImage from "../../assets/images/auth-side-image.jpg";


export function Login() {

const navigate =
  useNavigate();


const location =
  useLocation();

const redirectTo =
  location.state?.redirectTo;

const toastShown =
  useRef(false);

const { showToast } = useToast();

const [email, setEmail] =
  useState("");

const [password, setPassword] =
  useState("");

const [confirmPassword, setConfirmPassword] =
  useState("");

const [loading, setLoading] =
  useState(false);

const [isRegister, setIsRegister] =
useState(false);

const [isCompany, setIsCompany] =
useState(false);

const [showPassword, setShowPassword] =
useState(false);

const [showConfirmPassword, setShowConfirmPassword] =
useState(false);


const [cpf, setCpf] =
  useState("");

const [phone, setPhone] =
  useState("");

const [cnpj, setCnpj] =
  useState("");


const [fullName, setFullName] =
  useState("");

const [companyName, setCompanyName] =
  useState("");

const [acceptTerms, setAcceptTerms] =
  useState(false);




async function handleRegister(
  e: React.FormEvent
) {

  e.preventDefault();

  if (!acceptTerms) {

  showToast(
    "Você precisa aceitar os termos.",
    "error"
  );

  return;
}

  if (!isCompany) {

  if (
    cpf.length !== 14 ||
    !validateCPF(cpf)
  ) {

    showToast(
      "Digite um CPF válido.",
      "error"
    );

    return;
  }

} else {

  if (
    cnpj.length !== 18 ||
    !validateCNPJ(cnpj)
  ) {

    showToast(
      "Digite um CNPJ válido.",
      "error"
    );

    return;
  }
}

if (phone.length < 15) {

  showToast(
    "Digite um telefone válido.",
    "error"
  );

  return;
}

if (
  password.trim() !==
  confirmPassword.trim()
) {

    showToast(
      "As senhas não coincidem.",
      "error"
    );

    return;
  }

  if (!email.trim()) {

  showToast(
    "Digite seu e-mail.",
    "error"
  );

  return;
}

if (!password.trim()) {

  showToast(
    "Digite sua senha.",
    "error"
  );

  return;
}

if (password.length < 6) {

  showToast(
    "A senha precisa ter pelo menos 6 caracteres.",
    "error"
  );

  return;
}

  try {

    setLoading(true);

    const userCredential =
  await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

const user =
  userCredential.user;

await setDoc(

  doc(db, "users", user.uid),

  {
    uid: user.uid,


    name:
  isCompany
    ? companyName
    : fullName,

    email,

    role: "user",

    type:
      isCompany
        ? "company"
        : "personal",

    cpf:
      !isCompany
        ? cpf
        : null,

    cnpj:
      isCompany
        ? cnpj
        : null,

    phone,

    createdAt:
      new Date(),
  }

);
    showToast(
  "Conta criada com sucesso!"
);

setEmail("");

setPassword("");

setConfirmPassword("");

setCpf("");

setCnpj("");

setPhone("");

setAcceptTerms(false);

setIsCompany(false);

setIsRegister(false);

  } catch (error: any) {

    if (
      error.code ===
      "auth/email-already-in-use"
    ) {

      showToast(
        "Este e-mail já está em uso.",
        "error"
      );

    } else {

      console.log(error);

showToast(
  "Erro ao criar conta.",
  "error"
);
    }

  } finally {

    setLoading(false);
  }
}


async function handleLogin(
  e: React.FormEvent
) {

  e.preventDefault();

  if (!email.trim()) {

    showToast(
      "Digite seu e-mail.",
      "error"
    );

    return;
  }

  if (!password.trim()) {

    showToast(
      "Digite sua senha.",
      "error"
    );

    return;
  }

  try {

    setLoading(true);

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    showToast(
      "Login realizado com sucesso!"
    );

    setPassword("");

    navigate(
  redirectTo || "/"
);

  } catch (error: any) {

    if (
      error.code ===
      "auth/invalid-credential"
    ) {

      showToast(
        "E-mail ou senha inválidos.",
        "error"
      );

    } else {

      showToast(
        "Erro ao entrar.",
        "error"
      );
    }

  } finally {

    setLoading(false);
  }
}


useEffect(() => {

  if (
    toastShown.current
  ) {
    return;
  }

  if (
    location.state?.message
  ) {

    toastShown.current =
      true;

    showToast(
      location.state.message,
      "info"
    );

  }

}, [
  location.state,
  showToast,
]);

  return (

    <main className="login-page">

      <section className="login-container">

        <div className="login-left">

          <img
            src={authImage}
            alt="Somar"
          />

          <div className="login-overlay">

            <span>
              SOMAR
            </span>

            <h1>
              Pequenas ações transformam grandes vidas.
            </h1>

            <p>
              Faça parte da plataforma que conecta pessoas
              dispostas a ajudar quem mais precisa.
            </p>

          </div>

        </div>

        <div className="login-right">

          <div className="login-content">

            

            <div className="auth-switch">

  <button
    type="button"
    className={!isRegister ? "active" : ""}
    onClick={() => setIsRegister(false)}
  >
    Entrar
  </button>

  <button
    type="button"
    className={isRegister ? "active" : ""}
    onClick={() => setIsRegister(true)}
  >
    Criar conta
  </button>

</div>


{isRegister && (

  <div className="company-toggle">

    <span>
      Quero doar como empresa
    </span>

    <button
      type="button"
      className={`toggle-switch ${
        isCompany ? "active" : ""
      }`}
      onClick={() =>
        setIsCompany(!isCompany)
      }
    >

      <div className="toggle-circle" />

    </button>

  </div>

)}

<div className="login-top">

  <span>
    {isRegister
      ? "Junte-se à Somar"
      : "Bem-vindo de volta"}
  </span>

  <h2>
    {isRegister
      ? "Criar conta"
      : "Entrar"}
  </h2>

  <p>
    {isRegister
      ? "Crie sua conta e comece a transformar vidas hoje."
      : "Entre na sua conta para continuar ajudando pessoas."}
  </p>

</div>

           
<form
  className="login-form"
  onSubmit={
  isRegister
    ? handleRegister
    : handleLogin
}
>

  {isRegister ? (

    <>

      {!isCompany ? (

        <>
          
          <div className="form-section">

            <h3>
              Dados pessoais
            </h3>

            <div className="section-line" />

          </div>

          <div className="login-input-group">

            <label>
              Nome completo
            </label>

            <input
  type="text"
  placeholder="Digite seu nome"
  value={fullName}
  onChange={(e) =>
    setFullName(e.target.value)
  }
/>

          </div>

          <div className="double-input">

            <div className="login-input-group">

              <label>
                CPF
              </label>

              <input
  type="text"
  placeholder="000.000.000-00"
  value={cpf}
  onChange={(e) =>
    setCpf(
      formatCPF(e.target.value)
    )
  }
  className={
  cpf.length === 14 &&
  !validateCPF(cpf)
    ? "input-error"
    : ""
}
/>

{
  cpf.length === 14 &&
  !validateCPF(cpf) && (

    <span className="error-text">
      CPF inválido
    </span>

  )
}

            </div>

            <div className="login-input-group">

              <label>
                Telefone
              </label>

              <input
  type="text"
  placeholder="(00) 00000-0000"
  value={phone}
  onChange={(e) =>
    setPhone(
      formatPhone(e.target.value)
    )
  }
  className={
  phone.length === 15
    ? ""
    : phone.length > 0
      ? "input-error"
      : ""
}
/>

{
  phone.length > 0 &&
  phone.length < 15 && (

    <span className="error-text">
      Telefone inválido
    </span>

  )
}

            </div>

          </div>

        </>

      ) : (

        <>

          <div className="form-section">

            <h3>
              Dados da empresa
            </h3>

            <div className="section-line" />

          </div>

          <div className="login-input-group">

            <label>
              Razão social
            </label>

            <input
  type="text"
  placeholder="Nome da empresa LTDA"
  value={companyName}
  onChange={(e) =>
    setCompanyName(e.target.value)
  }
/>

          </div>

          <div className="login-input-group">

            <label>
              CNPJ
            </label>

          <input
  type="text"
  placeholder="00.000.000/0000-00"
  value={cnpj}
  onChange={(e) =>
    setCnpj(
      formatCNPJ(e.target.value)
    )
  }
 className={
  cnpj.length === 18 &&
  !validateCNPJ(cnpj)
    ? "input-error"
    : ""
}
/>

{
  cnpj.length === 18 &&
  !validateCNPJ(cnpj) && (

    <span className="error-text">
      CNPJ inválido
    </span>

  )
}
          </div>

          <div className="form-section second">

            <h3>
              Dados de contato
            </h3>

            <div className="section-line" />

          </div>

          <div className="login-input-group">

            <label>
              Nome completo
            </label>

            <input
              type="text"
              placeholder="Digite seu nome"
            />

          </div>

          <div className="double-input">

            <div className="login-input-group">

              <label>
                Cargo
              </label>

              <input
                type="text"
                placeholder="Auxiliar de suporte"
              />

            </div>

            <div className="login-input-group">

              <label>
                Telefone
              </label>

                <input
  type="text"
  placeholder="(00) 00000-0000"
  value={phone}
  onChange={(e) =>
    setPhone(
      formatPhone(e.target.value)
    )
  }
  className={
  phone.length === 15
    ? ""
    : phone.length > 0
      ? "input-error"
      : ""
}
/>

{
  phone.length > 0 &&
  phone.length < 15 && (

    <span className="error-text">
      Telefone inválido
    </span>
  )
}

            </div>

          </div>

        </>

      )}

      <div className="form-section second">

        <h3>
          Dados da conta
        </h3>

        <div className="section-line" />

      </div>

      <div className="login-input-group">

        <label>
          E-mail
        </label>

        <input
          type="email"
          placeholder="seuemail@mail.com"
          value={email}

onChange={(e) =>
  setEmail(e.target.value)
}
        />

      </div>

      <div className="double-input">

        <div className="login-input-group">

          <label>
            Senha
          </label>

          <div className="password-input">

 <input
  type={
    showPassword
      ? "text"
      : "password"
  }
  placeholder="******"
  value={password}
  onChange={(e) =>
    setPassword(
      e.target.value
    )
  }
/>

  <button
    type="button"
    className="password-toggle"
    onClick={() =>
      setShowPassword(!showPassword)
    }
  >

    {showPassword ? (
      <EyeOff size={20} />
    ) : (
      <Eye size={20} />
    )}

  </button>

</div>

        </div>

        <div className="login-input-group">

          <label>
            Repita a senha
          </label>

         <div className="password-input">

  <input
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }
    placeholder="******"
    value={confirmPassword}

onChange={(e) =>
  setConfirmPassword(
    e.target.value
  )
}
  />

  <button
    type="button"
    className="password-toggle"
    onClick={() =>
      setShowConfirmPassword(
        !showConfirmPassword
      )
    }
  >

    {showConfirmPassword ? (
      <EyeOff size={20} />
    ) : (
      <Eye size={20} />
    )}

  </button>

</div>

        </div>

      </div>

      <div className="login-terms">

       <input
  type="checkbox"
  checked={acceptTerms}
  onChange={() =>
    setAcceptTerms(!acceptTerms)
  }
/>

        <p>
          Ao continuar você concorda com os
          <span> Termos de uso </span>
          e
          <span> Política de Privacidade</span>
        </p>

      </div>

     <button type="submit">

  {
    loading
      ? "Criando conta..."
      : "Criar conta"
  }

</button>

    </>

  ) : (

    <>

      <div className="login-input-group">

        <label>
          E-mail
        </label>

        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}

onChange={(e) =>
  setEmail(e.target.value)
}
        />

      </div>

      <div className="login-input-group">

        <div className="login-label-row">

          <label>
            Senha
          </label>

          <button
            type="button"
            className="forgot-password"
          >
            Esqueceu a senha?
          </button>

        </div>

        <div className="password-input">

 <input
  type={
    showPassword
      ? "text"
      : "password"
  }
  placeholder="Digite sua senha"
  value={password}
  onChange={(e) =>
    setPassword(
      e.target.value
    )
  }
/>

  <button
    type="button"
    className="password-toggle"
    onClick={() =>
      setShowPassword(!showPassword)
    }
  >

    {showPassword ? (
      <EyeOff size={20} />
    ) : (
      <Eye size={20} />
    )}

  </button>

</div>

      </div>

      <div className="login-terms">

        

       
      </div>

     <button type="submit">

  {
    loading
      ? "Entrando..."
      : "Entrar"
  }

</button>

    </>

  )}

</form>


<div className="login-legal">

  <p>
    Ao continuar você concorda com nossos<br></br>
    <span> Termos de Uso </span>
    e
    <span> Política de Privacidade</span>.
  </p>

</div>

          </div>

        </div>

      </section>

    </main>

  );
}
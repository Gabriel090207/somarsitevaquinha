import "./CreateSubAccount.css";
import { useState } from "react";

import { api } from "../../services/api";
import axios from "axios";

import { IMaskInput } from "react-imask";

import Logo from "../../assets/images/logo.png";

export function CreateSubAccount() {

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [cpf, setCpf] = useState("");
const [birthDate, setBirthDate] = useState("");

const [mobilePhone, setMobilePhone] = useState("");
const [phone, setPhone] = useState("");

const [postalCode, setPostalCode] = useState("");
const [province, setProvince] = useState("");
const [address, setAddress] = useState("");
const [addressNumber, setAddressNumber] = useState("");
const [complement, setComplement] = useState("");

const [loading, setLoading] = useState(false);

const [incomeValue, setIncomeValue] = useState("");


function formatBirthDate(date: string) {
  const [day, month, year] = date.split("/");

  return `${year}-${month}-${day}`;
}

function formatCurrency(value: string) {
  const numbers = value.replace(/\D/g, "");

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(numbers) / 100);
}

function parseCurrency(value: string) {
  return Number(
    value.replace(/[^\d]/g, "")
  ) / 100;
}


const handleCreateSubAccount = async () => {
  try {
    setLoading(true);

    console.log({
  birthDate,
  postalCode,
});

const payload = {
  name,
  email,
  cpf_cnpj: cpf.replace(/\D/g, ""),
  birth_date: formatBirthDate(birthDate),
  company_type: "",
  income_value: parseCurrency(incomeValue),
  phone: phone.replace(/\D/g, ""),
  mobile_phone: mobilePhone.replace(/\D/g, ""),
  postal_code: postalCode.replace(/\D/g, ""),
  address,
  address_number: addressNumber,
  complement,
  province,
};

console.log(payload);

const response = await api.post(
  "/asaas/create-subaccount",
  payload
);


console.log(response.data);

    alert("Subconta criada com sucesso!");

  } catch (error) {

    if (axios.isAxiosError(error)) {
      alert(
        error.response?.data?.message ??
        "Erro ao criar subconta."
      );
    } else {
      alert("Erro inesperado.");
    }

  } finally {
    setLoading(false);
  }
};


  return (
    <main className="create-subaccount-page">

      <header className="create-header">

        <img
          src={Logo}
          alt="Somar"
          className="header-logo"
        />

      </header>

      <section className="create-subaccount-content">

        <div className="page-title">

          <span>
            Integração Asaas
          </span>

          <h1>
            Criar Subconta
          </h1>

        </div>

        <div className="create-campaign-grid">

          <div className="create-card">

            <div className="card-title">

              <strong>
                Dados Pessoais
              </strong>

              <p>
                Informe os dados do responsável pela subconta Asaas.
              </p>

            </div>

            <div className="form-field">

              <label>
                Nome Completo
              </label>

             <input
  type="text"
  placeholder="Digite seu nome completo"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

            </div>

            <div className="form-grid">

              <div className="form-field">

                <label>
                  E-mail
                </label>

              <input
  type="email"
  placeholder="Digite seu e-mail"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

              </div>

              <div className="form-field">

  <label>CPF</label>

 <IMaskInput
  mask="000.000.000-00"
  placeholder="000.000.000-00"
  className="form-input"
  value={cpf}
  onAccept={(value) => setCpf(String(value))}
/>

</div>

            </div>

           <div className="form-field">

  <label>Data de nascimento</label>

<IMaskInput
  mask="00/00/0000"
  placeholder="dd/mm/aaaa"
  className="form-input"
  value={birthDate}
  onAccept={(value) => setBirthDate(String(value))}
/>

</div>

          </div>



        </div>


<div className="create-card">

  <div className="card-title">

    <strong>
      Contato
    </strong>

    <p>
      Informe os meios de contato utilizados pelo titular da conta.
    </p>

  </div>

  <div className="form-grid">

    <div className="form-field">

      <label>
        Celular
      </label>

     <IMaskInput
  mask="(00) 00000-0000"
  placeholder="(00) 00000-0000"
  className="form-input"
  value={mobilePhone}
  onAccept={(value) => setMobilePhone(String(value))}
/>

    </div>

    <div className="form-field">

      <label>
        Telefone
      </label>

     <IMaskInput
  mask="(00) 0000-0000"
  placeholder="(00) 0000-0000"
  className="form-input"
  value={phone}
  onAccept={(value) => setPhone(String(value))}
/>
    </div>

  </div>

</div>
        

    <div className="create-card">

  <div className="card-title">

    <strong>
      Endereço
    </strong>

    <p>
      Informe o endereço residencial do titular da conta.
    </p>

  </div>

  <div className="form-grid">

    <div className="form-field">

      <label>
        CEP
      </label>

    <IMaskInput
  mask="00000-000"
  placeholder="00000-000"
  className="form-input"
  value={postalCode}
  onAccept={(value) => setPostalCode(String(value))}
/>
    </div>

    <div className="form-field">

      <label>
        Bairro
      </label>

      <input
  type="text"
  placeholder="Digite o bairro"
  value={province}
  onChange={(e) => setProvince(e.target.value)}
/>

    </div>

  </div>

  <div className="form-field">

    <label>
      Rua
    </label>

   <input
  type="text"
  placeholder="Digite a rua"
  value={address}
  onChange={(e) => setAddress(e.target.value)}
/>

  </div>

  <div className="form-grid">

    <div className="form-field">

      <label>
        Número
      </label>

     <input
  type="text"
  placeholder="Número"
  value={addressNumber}
  onChange={(e) => setAddressNumber(e.target.value)}
/>

    </div>

    <div className="form-field">

      <label>
        Complemento
      </label>

      <input
  type="text"
  placeholder="Apartamento, bloco, etc."
  value={complement}
  onChange={(e) => setComplement(e.target.value)}
/>

    </div>

  </div>

</div>


<div className="create-card">

  <div className="card-title">

    <strong>
      Dados Financeiros
    </strong>

    <p>
      Informe sua renda mensal aproximada. Essa informação é utilizada pelo Asaas durante o processo de validação da conta.
    </p>

  </div>

 <div className="form-field">

  <label>
    Renda Mensal
  </label>

<input
  type="text"
  placeholder="R$ 0,00"
  value={incomeValue}
  onChange={(event) =>
    setIncomeValue(
      formatCurrency(event.target.value)
    )
  }
/>

</div>

</div>


<div className="create-actions">

<button
  type="button"
  className="create-btn"
  onClick={handleCreateSubAccount}
  disabled={loading}
>
  {loading ? "Criando..." : "Criar Subconta"}
</button>

</div>

      </section>

    </main>
  );
}
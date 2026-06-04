import "./MonthlyDonationPage.css";

import monthlyHero from "../../assets/images/monthly-donation-bg.png";

import {
  ShieldCheck,
  BadgeCheck,
  HeartHandshake,
} from "lucide-react";

import {
  CreditCard,
  CalendarSync,
  CalendarX,
} from "lucide-react";


import { useNavigate }
  from "react-router-dom";

import { useState }
  from "react";

export function MonthlyDonationPage() {


const navigate =
  useNavigate();

const [customAmount, setCustomAmount] =
  useState("");

  return (

    <main className="monthly-page">

      <section className="monthly-hero">

        <img
          src={monthlyHero}
          alt=""
        />

        <div className="monthly-overlay" />

        <div className="monthly-hero-content">

          <span className="hero-badge">
            Doação recorrente
          </span>

          <h1>
  A gente conta as histórias,
  <br />

  mas é você quem
  <span>
    {" "}transforma finais.
  </span>
</h1>

<p>
  Faça uma doação mensal e ajude
  campanhas reais continuamente,
  de forma automática, segura e
  sem complicação.
</p>



          <button>
            Quero ser doador mensal
          </button>

          <small>
  Você pode cancelar quando quiser.
</small>

        </div>

      </section>


<section className="monthly-values">

  <div className="monthly-values-container">

    <div className="monthly-values-title">

      <span>
        Escolha um valor
      </span>

      <h2>
        Escolha o valor da sua doação mensal
      </h2>

    </div>

    <div className="monthly-values-grid">

      {["R$ 30", "R$ 50"].map((value) => (

        <div className="monthly-value-card">

          <h3>
            {value}
          </h3>

          <p>
            por mês
          </p>

          <button
  onClick={() =>
    navigate(
      `/monthly-checkout?amount=${value.replace(
        "R$ ",
        ""
      )}`
    )
  }
>
  Doar
</button>

        </div>

      ))}

      <div className="monthly-value-card active">

        <small>
          Mais popular
        </small>

        <h3>
          R$ 80
        </h3>

        <p>
          por mês
        </p>

        <button
  onClick={() =>
    navigate(
      "/monthly-checkout?amount=80"
    )
  }
>
  Doar
</button>

      </div>

      <div className="monthly-value-card">

        <h3>
          R$ 120
        </h3>

        <p>
          por mês
        </p>

       <button
  onClick={() =>
    navigate(
      "/monthly-checkout?amount=120"
    )
  }
>
  Doar
</button>
      </div>

     <div className="monthly-value-card">

  <h3 className="custom-value">
    Valor livre
  </h3>

  <input
    type="number"
    placeholder="Digite um valor"
    value={customAmount}
    onChange={(e) =>
      setCustomAmount(
        e.target.value
      )
    }
  />

  <button
    disabled={!customAmount}
    onClick={() =>
      navigate(
        `/monthly-checkout?amount=${customAmount}`
      )
    }
  >
    Doar
  </button>

</div>

    </div>

  </div>

</section>


<section className="monthly-story">

  <div className="monthly-story-container">

    {/* IMAGEM */}

    <div className="monthly-story-image">

      <img
        src={monthlyHero}
        alt=""
      />

    </div>

    {/* TEXTO */}

    <div className="monthly-story-content">

      <span>
        Impacto contínuo
      </span>

      <h2>
        Sua ajuda continua
        mudando histórias.
      </h2>

      <p>
        Ao participar da doação mensal,
        você ajuda campanhas continuamente
        e garante apoio recorrente para
        quem mais precisa.
      </p>

      <div className="monthly-story-list">

        <div>

          <ShieldCheck size={20} />

          <p>
            Campanhas verificadas
          </p>

        </div>

        <div>

          <BadgeCheck size={20} />

          <p>
            Transparência total
          </p>

        </div>

        <div>

          <HeartHandshake size={20} />

          <p>
            Impacto real todos os meses
          </p>

        </div>

      </div>

    </div>

  </div>

</section>

<section className="monthly-steps">

  <div className="monthly-steps-container">

    <div className="monthly-steps-title">

      <span>
        Como funciona
      </span>

      <h2>
        Como funciona a
        doação mensal?
      </h2>

    </div>

    <div className="monthly-steps-grid">

      <div className="monthly-step-card">

        <div className="monthly-step-icon">
          <CreditCard size={34} />
        </div>

        <h3>
          Pagamento automático
        </h3>

        <p>
          Sua contribuição acontece
          automaticamente todos os meses.
        </p>

      </div>

      <div className="monthly-step-card">

        <div className="monthly-step-icon">
          <CalendarSync size={34} />
        </div>

        <h3>
          Ajude continuamente
        </h3>

        <p>
          O valor fica disponível
          todos os meses para novas
          campanhas.
        </p>

      </div>

      <div className="monthly-step-card">

        <div className="monthly-step-icon">
          <HeartHandshake size={34} />
        </div>

        <h3>
          Impacto real
        </h3>

        <p>
          Você ajuda campanhas
          reais continuamente
          durante todo o ano.
        </p>

      </div>

      <div className="monthly-step-card">

        <div className="monthly-step-icon">
          <CalendarX size={34} />
        </div>

        <h3>
          Cancele quando quiser
        </h3>

        <p>
          Você possui liberdade
          total para cancelar
          quando desejar.
        </p>

      </div>

    </div>

  </div>

</section>


    </main>

  );
}
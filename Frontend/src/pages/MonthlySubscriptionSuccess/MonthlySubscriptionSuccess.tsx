import "../PaymentSuccess/PaymentSuccess.css";

import {
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export function MonthlySubscriptionSuccess() {

  const navigate = useNavigate();

  const location = useLocation();

  const amount =
    location.state?.amount || 0;

  const updated =
  location.state?.updated || false;

  function formatMoney(
    value: number
  ) {

    return value.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }

  return (

    <section className="payment-success-page">

      <div className="payment-success-card-mensal">

        <div className="payment-success-icon">

          <CheckCircle2 size={72} />

        </div>

      <span>

  {
    updated
      ? "Assinatura atualizada"
      : "Assinatura criada"
  }

</span>

       <h1>

  {
    updated

      ? "Sua doação mensal foi atualizada 💚"

      : "Sua doação mensal foi criada 💚"
  }

</h1>

        <p>

  {

    updated

      ? (
          <>
            Sua próxima cobrança
            será realizada no valor de

            <strong>
              {formatMoney(amount)}
            </strong>

            por mês.
          </>
        )

      : (
          <>
            Quando cada cobrança mensal
            for confirmada, o valor de

            <strong>
              {formatMoney(amount)}
            </strong>

            será adicionado à sua
            carteira Somar.
          </>
        )

  }

</p>

      

        <p>

          Você poderá acompanhar,
          alterar ou cancelar sua
          assinatura quando desejar
          pela sua área do usuário.

        </p>

       <button
  onClick={() =>
    navigate(
      updated
        ? "/minha-carteira"
        : "/"
    )
  }
>

  <ArrowLeft size={20} />

  {
    updated
      ? "Voltar para carteira"
      : "Voltar para início"
  }

</button>

      </div>

    </section>

  );
}
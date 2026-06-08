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

      <div className="payment-success-card">

        <div className="payment-success-icon">

          <CheckCircle2 size={72} />

        </div>

        <span>
          Assinatura criada
        </span>

        <h1>
          Sua doação mensal foi criada 💚
        </h1>

        <p>

          Quando cada cobrança mensal
          for confirmada, o valor de

          <strong>
            {
              formatMoney(amount)
            }
          </strong>

          será adicionado à sua
          carteira Somar.

        </p>

      

        <p>

          Você poderá acompanhar,
          alterar ou cancelar sua
          assinatura quando desejar
          pela sua área do usuário.

        </p>

        <button
          onClick={() => navigate("/")}
        >

          <ArrowLeft size={20} />

          Voltar para início

        </button>

      </div>

    </section>

  );
}
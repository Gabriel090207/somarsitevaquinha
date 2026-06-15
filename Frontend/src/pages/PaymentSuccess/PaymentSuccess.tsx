import "./PaymentSuccess.css";

import {
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export function PaymentSuccess() {

  const navigate = useNavigate();

  const location = useLocation();

const amount =
  Number(location.state?.amount) || 0;

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
          Pagamento aprovado
        </span>

        <h1>
          Obrigado pela sua doação 💚
        </h1>

        <p>

          Sua contribuição foi
          processada com sucesso.

        </p>

        <strong>

          {
            formatMoney(amount)
          }

        </strong>

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
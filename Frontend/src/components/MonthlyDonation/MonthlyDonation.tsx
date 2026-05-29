import "./MonthlyDonation.css";

import monthlyDonationBg from "../../assets/images/monthly-donation-bg.png";

import {
  ShieldCheck,
  PiggyBank,
  BadgeDollarSign,
} from "lucide-react";

import { Link }
  from "react-router-dom";

export function MonthlyDonation() {
  return (
    <section
      className="monthly-donation"
      style={{
        backgroundImage: `url(${monthlyDonationBg})`,
      }}
    >
      <div className="monthly-overlay" />

      <div className="monthly-container">

        <div className="monthly-left">

          <span className="monthly-badge">
            Novidade!
          </span>

         <h2>
  Seja um <span>Somador</span> e
  ajude mensalmente a
  mudar vidas.
</h2>

        </div>

        <div className="monthly-right">

          <p>
            Você escolhe um valor fixo para doar mensalmente
            e ele será destinado para campanhas verificadas
            da plataforma Somar.
          </p>


           <Link
  to="/doador-mensal"
  className="monthly-button2"
>

  Saiba mais

</Link>

          <div className="monthly-benefits">

            <div className="monthly-benefit">
              <ShieldCheck size={68} />

              <strong>
                100% seguro
              </strong>
            </div>

            <div className="monthly-benefit">
              <PiggyBank size={68} />

              <strong>
                Cabe no bolso
              </strong>
            </div>

            <div className="monthly-benefit">
              <BadgeDollarSign size={68} />

              <strong>
                Sem mensalidade
              </strong>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
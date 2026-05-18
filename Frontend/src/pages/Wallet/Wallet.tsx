import "./Wallet.css";

import {
  useState,
} from "react";

import {
  EyeOff,
  Wallet as WalletIcon,
} from "lucide-react";

export function Wallet() {

  const [
    activeTab,
    setActiveTab,
  ] = useState("monthly");

  return (

    <section className="wallet">

      <div className="wallet-container">

        <h1>
          Minha carteira
        </h1>

        <div className="wallet-content">

          <aside className="wallet-sidebar">

            <div className="wallet-balance-card">

              <div className="wallet-balance-top">

                <div>

                  <span>
                    Saldo
                  </span>

                  <h2>
                    R$ 0,00
                  </h2>

                </div>

                <button>

                  <EyeOff size={24} />

                </button>

              </div>

              <div className="wallet-icon">

                <WalletIcon size={40} />

              </div>

            </div>

            <div className="wallet-menu">

              <button
                className={
                  activeTab ===
                  "monthly"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "monthly"
                  )
                }
              >

                Doação mensal

              </button>

              <button
                className={
                  activeTab ===
                  "customization"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "customization"
                  )
                }
              >

                Personalização

              </button>

            </div>

          </aside>

          <div className="wallet-main">

            {

              activeTab ===
              "monthly" && (

                <>

                  <div className="wallet-section">

                    <h3>
                      Ativa
                    </h3>

                    <p>
                      Você não possui
                      uma doação mensal
                      ativa.
                    </p>

                  </div>

                  <div className="wallet-section">

                    <h3>
                      Inativa
                    </h3>

                    <p>
                      Você não possui
                      uma doação mensal
                      inativa.
                    </p>

                  </div>

                </>

              )

            }

            {

              activeTab ===
              "customization" && (

                <div className="wallet-section">

                  <h3>
                    Personalização
                  </h3>

                  <p>
                    Nenhuma opção
                    disponível no momento.
                  </p>

                </div>

              )

            }

          </div>

        </div>

      </div>

    </section>

  );
}
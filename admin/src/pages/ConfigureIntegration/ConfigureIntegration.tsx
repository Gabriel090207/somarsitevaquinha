import "./ConfigureIntegration.css";

import { Sidebar } from "../../components/Sidebar/Sidebar";

import { Copy } from "lucide-react";

export function ConfigureIntegration() {

  return (

    <main className="configure-page">

      <Sidebar />

      <section className="configure-content">

        <div className="configure-header">

          <span>
            Gerenciamento
          </span>

          <h1>
            Configurar Integração
          </h1>

        </div>

        <div className="integration-card">

          <h2>
            Ana Clara Oliveira
          </h2>

          <p>
            anaclara@email.com
          </p>

          <div className="integration-account">

            <span>

              <b>Account ID</b>

            </span>

            <div className="account-id">

              000997887665544332211

              <button
                className="copy-account-id"
                type="button"
              >

                <Copy size={15} />

              </button>

            </div>

          </div>

          <div className="integration-divider" />

          <div className="integration-section">

            <h3>
              API Key
            </h3>

            <span className="status pending">
              Pendente
            </span>

            <button className="integration-button">
              Gerar API Key
            </button>

          </div>

          <div className="integration-divider" />

          <div className="integration-section">

            <h3>
              Webhook
            </h3>

            <span className="status pending">
              Pendente
            </span>

            <button className="integration-button">
              Configurar Webhook
            </button>

          </div>

        </div>

      </section>

    </main>

  );

}
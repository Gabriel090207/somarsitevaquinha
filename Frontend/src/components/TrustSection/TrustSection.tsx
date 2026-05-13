import "./TrustSection.css";

import {
  Handshake,
  FileSearch,
  ShieldCheck,
} from "lucide-react";

export function TrustSection() {
  return (
    <section className="trust-section">

      <div className="trust-container">

        <div className="trust-card">

          <div className="trust-icon">
            <Handshake size={52} />
          </div>

          <h3>
            Relacionamento
          </h3>

          <p>
            Criamos uma relação de confiança com
            beneficiários e doadores. Garantimos
            que cada doação seja destinada da
            forma correta.
          </p>

        </div>

        <div className="trust-card">

          <div className="trust-icon">
            <FileSearch size={52} />
          </div>

          <h3>
            Transparência
          </h3>

          <p>
            Todas as campanhas passam por
            análise e acompanhamento para
            garantir clareza e segurança
            durante todo o processo.
          </p>

        </div>

        <div className="trust-card">

          <div className="trust-icon">
            <ShieldCheck size={52} />
          </div>

          <h3>
            Garantia
          </h3>

          <p>
            A Somar verifica as histórias antes
            da publicação para que você possa
            ajudar com mais segurança e
            confiança.
          </p>

        </div>

      </div>

    </section>
  );
}
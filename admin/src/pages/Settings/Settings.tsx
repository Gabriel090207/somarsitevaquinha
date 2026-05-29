import "./Settings.css";

import { Sidebar }
  from "../../components/Sidebar/Sidebar";

import {
  Construction,
} from "lucide-react";

export function Settings() {

  return (

    <main className="settings-page">

      <Sidebar />

      <section className="settings-content">

        <div className="settings-header">

          <div>

            <span>
              Plataforma
            </span>

            <h1>
              Configurações
            </h1>

          </div>

        </div>

        <div className="settings-empty">

          <Construction size={48} />

          <strong>
            Em desenvolvimento
          </strong>

          <p>
            Esta área está sendo remodelada
            e novas configurações serão
            disponibilizadas em breve.
          </p>

        </div>

      </section>

    </main>

  );
}
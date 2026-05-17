import "./Donations.css";

import {
  useState,
} from "react";

export function Donations() {

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  const [
    activeTab,
    setActiveTab,
  ] = useState("single");

  return (

    <section className="donations">

      <div className="donations-container">

        <div className="donations-header">

          <h1>
            Minhas Doações
          </h1>

          <p>
            Veja todas suas doações abaixo.
          </p>

        </div>

        <div className="donations-content">

          <aside className="donations-sidebar">

            <h3>
              Filtros
            </h3>

            <div className="donations-filters">

              <button
                className={
                  activeFilter === "all"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFilter(
                    "all"
                  )
                }
              >

                Todas

              </button>

              <button
                className={
                  activeFilter ===
                  "approved"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFilter(
                    "approved"
                  )
                }
              >

                Aprovadas

              </button>

              <button
                className={
                  activeFilter ===
                  "pending"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFilter(
                    "pending"
                  )
                }
              >

                Pendente

              </button>

              <button
                className={
                  activeFilter ===
                  "rejected"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFilter(
                    "rejected"
                  )
                }
              >

                Rejeitadas

              </button>

              <button
                className={
                  activeFilter ===
                  "following"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFilter(
                    "following"
                  )
                }
              >

                Seguindo

              </button>

              <button
                className={
                  activeFilter ===
                  "finished"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFilter(
                    "finished"
                  )
                }
              >

                Desfechos

              </button>

            </div>

          </aside>

          <div className="donations-main">

            <div className="donations-tabs">

              <button
                className={
                  activeTab ===
                  "single"

                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "single"
                  )
                }
              >

                Avulsa

              </button>

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

            </div>

            <div className="donations-empty">

              <p>
                Nenhuma doação
                para esse filtro.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>

  );
}
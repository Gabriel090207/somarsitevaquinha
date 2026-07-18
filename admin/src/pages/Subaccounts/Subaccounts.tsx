import "./Subaccounts.css";

import { Sidebar } from "../../components/Sidebar/Sidebar";

import {
  Search,
  Trash2,
  Copy,
} from "lucide-react";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

export function Subaccounts() {

  const [search, setSearch] =
    useState("");


    const navigate = useNavigate();

  return (

    <main className="subaccounts-page">

      <Sidebar />

      <section className="subaccounts-content">

        <div className="subaccounts-header">

          <div>

            <span>
              Gerenciamento
            </span>

            <h1>
              Subcontas
            </h1>

          </div>

        </div>

        <div className="subaccounts-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar subconta..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <div className="subaccounts-list">

  <div className="subaccount-item">

    <div className="subaccount-left">

      <div className="subaccount-avatar">
        A
      </div>

      <div className="subaccount-info">

       <strong>
  Ana Clara Oliveira
</strong>

<p>
  anaclara@email.com
</p>

<div className="subaccount-extra">

  <span>
    <b>Senha:</b> Ana@2025#
  </span>

  <span>

    <b>Account ID:</b>

    <span className="account-id">

      000997887665544332211

      <button
        className="copy-account-id"
        type="button"
      >
        <Copy size={15} />
      </button>

    </span>

  </span>

</div>



  

      </div>

    </div>

   <div className="subaccount-actions">

  <button
  className="configure-subaccount"
  type="button"
  onClick={() => navigate("/configurar-integracao")}
>
  Configurar
</button>

  <button
    className="subaccount-delete"
    type="button"
  >
    <Trash2 size={18} />
  </button>

</div>

  </div>

</div>

      </section>

    </main>

  );

}
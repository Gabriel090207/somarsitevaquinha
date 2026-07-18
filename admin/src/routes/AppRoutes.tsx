import {
  Routes,
  Route,
} from "react-router-dom";

import { Login }
  from "../pages/Login/Login";

import { Dashboard }
  from "../pages/Dashboard/Dashboard";

import { Campaigns }
  from "../pages/Campaigns/Campaigns";

import { Users }
  from "../pages/Users/Users";

import { Donations }
  from "../pages/Donations/Donations";

import { Settings }
  from "../pages/Settings/Settings";

import { CreateCampaign }
  from "../pages/CreateCampaign/CreateCampaign";

import { EditCampaign }
  from "../pages/EditCampaign/EditCampaign";

import { PrivateRoute }
  from "./PrivateRoute";

import { Subscribers }
  from "../pages/Subscribers/Subscribers";


import { Revenues }
  from "../pages/Revenues/Revenues";


import { Subaccounts }
  from "../pages/Subaccounts/Subaccounts";

import { ConfigureIntegration } from "../pages/ConfigureIntegration/ConfigureIntegration";

export function AppRoutes() {

  return (

    <Routes>

      {/* LOGIN */}

      <Route
        path="/"
        element={<Login />}
      />

      {/* DASHBOARD */}

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* CAMPAIGNS */}

      <Route
        path="/vaquinhas"
        element={
          <PrivateRoute>
            <Campaigns />
          </PrivateRoute>
        }
      />

      <Route
        path="/vaquinhas/nova"
        element={
          <PrivateRoute>
            <CreateCampaign />
          </PrivateRoute>
        }
      />

      <Route
        path="/vaquinhas/editar/:slug"
        element={
          <PrivateRoute>
            <EditCampaign />
          </PrivateRoute>
        }
      />

      {/* USERS */}

      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }
      />

      {/* DONATIONS */}

      <Route
        path="/doacoes"
        element={
          <PrivateRoute>
            <Donations />
          </PrivateRoute>
        }
      />

      {/* SETTINGS */}

      <Route
        path="/configuracoes"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />

     <Route
  path="/assinantes"
  element={
    <PrivateRoute>
      <Subscribers />
    </PrivateRoute>
  }
/>


<Route
  path="/receitas"
  element={
    <PrivateRoute>
      <Revenues />
    </PrivateRoute>
  }
/>


<Route
  path="/subcontas"
  element={
    <PrivateRoute>
      <Subaccounts />
    </PrivateRoute>
  }
/>


<Route
  path="/configurar-integracao"
  element={<ConfigureIntegration />}
/>

    </Routes>

  );
}
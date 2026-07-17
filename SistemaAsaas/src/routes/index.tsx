import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CreateSubAccount } from "../pages/CreateSubAccount/CreateSubAccount";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<CreateSubAccount />}
        />
      </Routes>
    </BrowserRouter>
  );
}
import { AppRoutes }
  from "./routes/AppRoutes";

import { ScrollToTop }
  from "./components/ScrollToTop/ScrollToTop";

export default function App() {

  return (
    <>

      <ScrollToTop />

      <AppRoutes />

    </>
  );
}
import { AppRoutes }
  from "./routes/AppRoutes";

import { Toast }
  from "./components/Toast/Toast";

import { useToast }
  from "./contexts/ToastContext";

import { ScrollToTop }
  from "./components/ScrollToTop/ScrollToTop";


export default function App() {

  const {
    toast,
    closeToast,
  } = useToast();

  return (
    <>

      <ScrollToTop />

      <AppRoutes />

      {toast && (

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />

      )}

    </>
  );
}
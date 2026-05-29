import {
  createContext,
  useContext,
  useState,
} from "react";

import { Toast }
  from "../components/Toast/Toast";

type ToastType =
  | "success"
  | "error"
  | "info";

type ToastState = {
  message: string;
  type: ToastType;
};

type ToastContextData = {
  toast: ToastState | null;

  showToast: (
    message: string,
    type?: ToastType
  ) => void;

  closeToast: () => void;
};

const ToastContext =
  createContext({} as ToastContextData);

export function ToastProvider({
  children,
}: any) {

  const [toast, setToast] =
    useState<ToastState | null>(
      null
    );

  function showToast(
    message: string,
    type: ToastType = "success"
  ) {

    setToast({
      message,
      type,
    });

    setTimeout(() => {

      setToast(null);

    }, 3500);
  }

  function closeToast() {

    setToast(null);
  }

  return (

    <ToastContext.Provider
      value={{
        toast,
        showToast,
        closeToast,
      }}
    >

      {children}

      {toast && (

        <div className="toast-container">

          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />

        </div>

      )}

    </ToastContext.Provider>
  );
}

export function useToast() {

  return useContext(
    ToastContext
  );
}
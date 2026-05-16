import {
  createContext,
  useContext,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import { Toast } from "../components/Toast/Toast";

type ToastType =
  | "success"
  | "error"
  | "info";

type ToastData = {
  id: number;

  message: string;

  type: ToastType;
};

type ToastContextData = {
  showToast: (
    message: string,
    type?: ToastType
  ) => void;
};

const ToastContext =
  createContext({} as ToastContextData);

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [toasts, setToasts] =
    useState<ToastData[]>([]);

  function showToast(
    message: string,
    type: ToastType = "success"
  ) {

    const id = Date.now();

    setToasts((old) => [

      ...old,

      {
        id,
        message,
        type,
      },

    ]);

    setTimeout(() => {

      removeToast(id);

    }, 3500);
  }

  function removeToast(id: number) {

    setToasts((old) =>
      old.filter(
        (toast) => toast.id !== id
      )
    );
  }

  return (

    <ToastContext.Provider
      value={{ showToast }}
    >

      {children}

      <div className="toast-container">

        {toasts.map((toast) => (

          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() =>
              removeToast(toast.id)
            }
          />

        ))}

      </div>

    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
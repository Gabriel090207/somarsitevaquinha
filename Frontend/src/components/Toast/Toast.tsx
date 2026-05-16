import "./Toast.css";

import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

type ToastProps = {
  message: string;

  type?: "success" | "error" | "info";

  onClose: () => void;
};

export function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {

  function renderIcon() {

    switch (type) {

      case "error":
        return <AlertCircle size={22} />;

      case "info":
        return <Info size={22} />;

      default:
        return <CheckCircle2 size={22} />;
    }
  }

  return (

    <div className={`toast ${type}`}>

      <div className="toast-icon">

        {renderIcon()}

      </div>

      <p>
        {message}
      </p>

      <button
        className="toast-close"
        onClick={onClose}
      >

        <X size={18} />

      </button>

    </div>

  );
}
import React, { createContext, useContext, useState, useCallback } from "react";
import { Modal } from "../components/ui/modal";
import { setOnApiError } from "@repo/api-client";

export type AlertVariant = "success" | "error" | "info" | "warning";

interface AlertOptions {
  title: string;
  description: string;
  variant?: AlertVariant;
  confirmLabel?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
  cancelLabel?: string;
}

interface AlertContextProps {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

let globalShowAlert: ((options: AlertOptions) => void) | null = null;

export const showGlobalAlert = (options: AlertOptions) => {
  if (globalShowAlert) {
    globalShowAlert(options);
  }
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({
    title: "",
    description: "",
    variant: "info",
  });

  const showAlert = useCallback((opts: AlertOptions) => {
    setOptions(opts);
    setVisible(true);
  }, []);

  React.useEffect(() => {
    globalShowAlert = showAlert;

    setOnApiError((message: string) => {
      if (
        message === "Authentication token is missing" ||
        message === "Unauthorized" ||
        message.toLowerCase().includes("token")
      ) {
        return;
      }
      showAlert({
        title: "Request Failed",
        description: message,
        variant: "error",
      });
    });

    return () => {
      globalShowAlert = null;
      setOnApiError(() => { });
    };
  }, [showAlert]);

  const hideAlert = useCallback(() => {
    setVisible(false);
  }, []);

  const handleConfirm = () => {
    hideAlert();
    if (options.onConfirm) {
      options.onConfirm();
    }
  };

  // Maps custom alert variants to Modal confirm button variants
  const confirmVariantMap: Record<AlertVariant, "primary" | "secondary" | "danger" | "success"> = {
    success: "success",
    error: "danger",
    info: "primary",
    warning: "danger",
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Modal
        visible={visible}
        title={options.title}
        description={options.description}
        confirmLabel={options.confirmLabel || "OK"}
        cancelLabel={options.showCancel ? options.cancelLabel || "Cancel" : ""}
        onConfirm={handleConfirm}
        confirmVariant={confirmVariantMap[options.variant || "info"]}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
};

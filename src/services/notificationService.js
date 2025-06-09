import { toast } from "sonner";

export const notify = {
  success: (message, description = "", action = null) => {
    toast.success(message, {
      description,
      action,
      duration: 3000,
    });
  },
  
  error: (message, description = "", action = null) => {
    toast.error(message, {
      description,
      action,
      duration: 3000,
    });
  },
  
  info: (message, description = "", action = null) => {
    toast.info(message, {
      description,
      action,
      duration: 3000,
    });
  },
  
  warning: (message, description = "", action = null) => {
    toast.warning(message, {
      description,
      action,
      duration: 3000,
    });
  },
  
  confirm: (message, onConfirm, onCancel = () => {}) => {
    toast(message, {
      action: {
        label: "Confirmar",
        onClick: onConfirm,
      },
      cancel: {
        label: "Cancelar",
        onClick: onCancel,
      },
      duration: Infinity, // Permanece hasta que el usuario haga clic en una opción
      closeButton: false, // Oculta el botón de cerrar para forzar una elección
    });
  }
};


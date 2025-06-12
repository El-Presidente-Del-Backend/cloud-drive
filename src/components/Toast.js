import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster 
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#fff",
          color: "#202124",
          border: "1px solid #e0e0e0",
        },
      }}
    />
  );
}

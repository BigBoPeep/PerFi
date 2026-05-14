import { createContext, useContext, useState, useCallback } from "react";
import type React from "react";

const sharedTransition = "duration-300";

interface ConfirmModalOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface ConfirmModalContextType {
  confirm: (options: ConfirmModalOptions) => Promise<boolean>;
}

const ConfirmModalContext = createContext<ConfirmModalContextType | null>(null);

interface ModalState extends ConfirmModalOptions {
  resolve: (value: boolean) => void;
}

export const ConfirmModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const confirm = useCallback(
    (options: ConfirmModalOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setModal({ ...options, resolve });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsOpen(true));
        });
      });
    },
    [],
  );

  const handleConfirm = () => {
    modal?.resolve(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    modal?.resolve(false);
    setIsOpen(false);
  };

  const handleTransitionEnd = () => {
    if (!isOpen) setModal(null);
  };

  return (
    <ConfirmModalContext.Provider value={{ confirm }}>
      {children}

      {modal && (
        <div className={`fixed inset-0 z-100 flex items-center justify-center`}>
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity
              backdrop-blur-lg
              ${isOpen ? "opacity-100" : "opacity-0"} ${sharedTransition}`}
            onTransitionEnd={handleTransitionEnd}
          />

          <div
            className={`relative z-10 w-full max-w-xs rounded-md bg-white p-3
              shadow-xl transition-transform
              ${isOpen ? "translate-0 scale-100" : "-translate-y-full scale-x-0"} 
              ${sharedTransition}`}
          >
            <h3>{modal.title}</h3>
            <p>{modal.message}</p>

            <div className="mt-4 flex justify-evenly">
              <button onClick={handleCancel}>
                {modal.cancelLabel ?? "Cancel"}
              </button>
              <button
                onClick={handleConfirm}
                className={modal.danger ? "text-red-600" : ""}
              >
                {modal.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmModalContext.Provider>
  );
};

export const useConfirmModal = () => {
  const context = useContext(ConfirmModalContext);
  if (!context)
    throw new Error(
      "useConfirmModal must be used within a ConfirmModalProvider",
    );
  return context;
};

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

interface ModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function StartProjectModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen, open, close, triggerRef }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useStartProjectModal() {
  const ctx = useContext(ModalContext);
  if (!ctx)
    throw new Error(
      "useStartProjectModal must be used within StartProjectModalContextProvider",
    );
  return ctx;
}

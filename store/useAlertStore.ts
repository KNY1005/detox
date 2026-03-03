import { create } from "zustand";

export type AlertVariant = "default" | "danger";

export interface AlertItem {
  id: string;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: AlertVariant;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface AlertStoreState {
  stack: AlertItem[];
  push: (alert: Omit<AlertItem, "id">) => void;
  shift: () => AlertItem | undefined;
  clear: () => void;
}

let idCounter = 0;
const generateId = () => `alert-${++idCounter}-${Date.now()}`;

export const useAlertStore = create<AlertStoreState>((set, get) => ({
  stack: [],

  push: (alert) => {
    const item: AlertItem = {
      ...alert,
      id: generateId(),
    };
    set((state) => ({
      stack: [...state.stack, item],
    }));
  },

  shift: () => {
    const [current, ...rest] = get().stack;
    set({ stack: rest });
    return current;
  },

  clear: () => set({ stack: [] }),
}));

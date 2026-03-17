import { create } from "zustand";
import { persist } from "zustand/middleware";

const PERSIST_NAME = "funnel-persist";

export interface PersistedFunnelDraft {
  state: Record<string, unknown>;
  stepIndex: number;
}

interface FunnelPersistState {
  drafts: Record<string, PersistedFunnelDraft>;
  setDraft: (
    key: string,
    state: Record<string, unknown>,
    stepIndex: number
  ) => void;
  getDraft: (key: string) => PersistedFunnelDraft | null;
  clearDraft: (key: string) => void;
}

/** SSR/초기 렌더 시 동기적으로 localStorage에서 draft 로드 (persist hydration 전) */
export function getDraftSync(key: string): PersistedFunnelDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PERSIST_NAME);
    if (!raw) return null;
    // Zustand persist 형식: { state: S, version?: number }
    const parsed = JSON.parse(raw) as {
      state?: { drafts?: Record<string, PersistedFunnelDraft> };
    };
    const drafts = parsed?.state?.drafts;
    const draft = drafts?.[key];
    if (!draft?.state || typeof draft.stepIndex !== "number") return null;
    return draft;
  } catch {
    return null;
  }
}

export const useFunnelPersistStore = create<FunnelPersistState>()(
  persist(
    (set, get) => ({
      drafts: {},
      setDraft: (key, state, stepIndex) =>
        set((s) => ({
          drafts: { ...s.drafts, [key]: { state, stepIndex } },
        })),
      getDraft: (key) => get().drafts[key] ?? null,
      clearDraft: (key) =>
        set((s) => {
          const { [key]: _, ...rest } = s.drafts;
          return { drafts: rest };
        }),
    }),
    {
      name: PERSIST_NAME,
      partialize: (state) => ({ drafts: state.drafts }),
    }
  )
);

import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FunnelState<T = unknown> {
  currentStepIndex: number;
  stepHistory: number[]; // 방문한 step index 스택 (뒤로가기용)
  state: T;
  steps: readonly string[];
}

interface FunnelStore {
  funnels: Record<string, FunnelState>;
  initFunnel: (
    key: string,
    steps: readonly string[],
    initialState: unknown,
    initialStepIndex?: number
  ) => void;
  next: (key: string) => void;
  prev: (key: string) => void;
  setStep: (key: string, stepIndex: number) => void;
  setState: (
    key: string,
    partial: Partial<unknown> | ((prev: unknown) => unknown)
  ) => void;
  reset: (key: string) => void;
  destroy: (key: string) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useFunnelStore = create<FunnelStore>((set, get) => ({
  funnels: {},

  initFunnel: (key, steps, initialState, initialStepIndex = 0) => {
    // 이미 초기화된 funnel이면 스킵 (재렌더 시 초기화 방지)
    if (get().funnels[key]) return;

    // URL/query 복원 시 initialStepIndex > 0이면 stepHistory를 채워 canGoPrev/back 동작
    const stepHistory =
      initialStepIndex > 0
        ? Array.from({ length: initialStepIndex }, (_, i) => i)
        : [];

    set((state) => ({
      funnels: {
        ...state.funnels,
        [key]: {
          currentStepIndex: initialStepIndex,
          stepHistory,
          state: initialState,
          steps,
        },
      },
    }));
  },

  next: (key) =>
    set((state) => {
      const funnel = state.funnels[key];
      if (!funnel) return state;

      // 마지막 step을 넘지 않도록 clamp
      const nextIndex = Math.min(
        funnel.currentStepIndex + 1,
        funnel.steps.length - 1
      );

      if (nextIndex === funnel.currentStepIndex) {
        return state;
      }

      return {
        funnels: {
          ...state.funnels,
          [key]: {
            ...funnel,
            currentStepIndex: nextIndex,
            // 현재 index를 history에 push → prev()에서 pop해서 복귀
            stepHistory: [...funnel.stepHistory, funnel.currentStepIndex],
          },
        },
      };
    }),

  prev: (key) =>
    set((state) => {
      const funnel = state.funnels[key];
      if (!funnel || funnel.stepHistory.length === 0) return state;

      // history 스택에서 마지막 index를 pop해서 복귀
      // 단순히 currentStepIndex - 1이 아닌 이유:
      // setStep()으로 step을 건너뛰었을 때도 정확히 이전 step으로 돌아오기 위해
      const history = [...funnel.stepHistory];
      const prevIndex = history.pop()!;

      return {
        funnels: {
          ...state.funnels,
          [key]: {
            ...funnel,
            currentStepIndex: prevIndex,
            stepHistory: history,
          },
        },
      };
    }),

  setStep: (key, stepIndex) =>
    set((state) => {
      const funnel = state.funnels[key];
      if (!funnel) return state;

      const nextIndex = Math.max(
        0,
        Math.min(stepIndex, funnel.steps.length - 1)
      );

      if (nextIndex === funnel.currentStepIndex) {
        return state;
      }

      return {
        funnels: {
          ...state.funnels,
          [key]: {
            ...funnel,
            currentStepIndex: stepIndex,
            // 점프 전 index도 history에 쌓아야 뒤로가기 시 정확히 복귀 가능
            stepHistory: [...funnel.stepHistory, funnel.currentStepIndex],
          },
        },
      };
    }),

  setState: (key, partial) =>
    set((state) => {
      const funnel = state.funnels[key];
      if (!funnel) return state;

      const nextState =
        typeof partial === "function"
          ? (partial as (prev: unknown) => unknown)(funnel.state)
          : { ...(funnel.state as object), ...partial };

      return {
        funnels: { ...state.funnels, [key]: { ...funnel, state: nextState } },
      };
    }),

  reset: (key) =>
    set((state) => {
      const funnel = state.funnels[key];
      if (!funnel) return state;

      // step과 history만 초기화. state 데이터는 유지
      return {
        funnels: {
          ...state.funnels,
          [key]: { ...funnel, currentStepIndex: 0, stepHistory: [] },
        },
      };
    }),

  destroy: (key) =>
    set((state) => {
      // key에 해당하는 funnel을 store에서 완전히 제거
      const { [key]: _, ...rest } = state.funnels;
      return { funnels: rest };
    }),
}));

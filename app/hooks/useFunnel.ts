import { useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useFunnelStore } from "@/store/useFunnelStore";
import {
  getDraftSync,
  useFunnelPersistStore,
} from "@/store/useFunnelPersistStore";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UseFunnelOptions<T, S extends readonly string[]> {
  key: string;
  steps: S;
  initialState: T;
  /**
   * URL 쿼리 파라미터와 동기화.
   * true면 ?{queryKey}=stepName 형태로 URL이 업데이트됨
   * 새로고침해도 현재 step이 URL에서 복원됨
   * ex) /signup?signup=password
   */
  syncWithQuery?: boolean;
  /**
   * 쿼리 파라미터 키 이름 (기본값: key prop)
   * 다중 퍼널 시 key가 다르면 자동으로 충돌 방지됨
   * ex) ?signup=email&payment=card
   */
  queryKey?: string;
  /**
   * 언마운트 시 store에서 funnel 제거 (기본값: true)
   * false로 설정하면 페이지 이동 후 돌아와도 상태 유지
   */
  destroyOnUnmount?: boolean;
  /**
   * URL 쿼리에 step이 없을 때 사용할 초기 step index
   * (예: localStorage에서 복원한 draft의 step)
   */
  initialStepIndex?: number;
  /**
   * 이 키로 Zustand persist에 draft 저장 (새로고침/이탈 시 복원)
   * 설정 시 clearPersistedDraft가 반환됨
   */
  persistKey?: string;
}

export type StepType<S extends readonly string[]> = S[number];

export interface UseFunnelReturn<T, S extends readonly string[]> {
  currentStep: StepType<S>;
  currentStepIndex: number;
  state: T;
  steps: S;
  canGoPrev: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  setState: (partial: Partial<T> | ((prev: T) => T)) => void;
  next: () => void;
  /** canGoPrev가 false일 때 onExit 호출 (ex. router.back()으로 페이지 이탈) */
  back: (onExit?: () => void) => void;
  reset: () => void;
  /** step index 대신 step 이름으로 직접 이동 */
  setStep: (step: StepType<S>) => void;
  /** persistKey 설정 시: draft 삭제 (제출 성공 후 호출) */
  clearPersistedDraft?: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFunnel<T, S extends readonly string[]>({
  key,
  steps,
  initialState,
  syncWithQuery = false,
  queryKey,
  destroyOnUnmount = true,
  initialStepIndex,
  persistKey,
}: UseFunnelOptions<T, S>): UseFunnelReturn<T, S> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 다중 퍼널 시 queryKey 충돌 방지를 위해 기본값을 key로 사용
  // ex) useFunnel({ key: 'signup' }) → ?signup=email
  //     useFunnel({ key: 'payment' }) → ?payment=card
  const resolvedQueryKey = queryKey ?? key;

  // ─── Store actions ──────────────────────────────────────────────────────────
  const initFunnel = useFunnelStore((s) => s.initFunnel);
  const next = useFunnelStore((s) => s.next);
  const prev = useFunnelStore((s) => s.prev);
  const setStoreStep = useFunnelStore((s) => s.setStep);
  const setStoreState = useFunnelStore((s) => s.setState);
  const reset = useFunnelStore((s) => s.reset);
  const destroy = useFunnelStore((s) => s.destroy);

  // ─── Funnel state ───────────────────────────────────────────────────────────
  const funnel = useFunnelStore((s) =>
    s.funnels[key]
      ? (s.funnels[key] as {
          currentStepIndex: number;
          stepHistory: number[];
          state: T;
          steps: readonly string[];
        })
      : null
  );

  // ─── Init ───────────────────────────────────────────────────────────────────
  // steps와 initialState를 ref로 고정하는 이유:
  // 컴포넌트가 렌더될 때마다 steps/initialState는 새로운 객체로 생성됨 (참조값 변경)
  // useEffect 의존성에 넣으면 렌더마다 initFunnel이 호출되어 퍼널이 계속 초기화됨
  const stepsRef = useRef(steps);
  const initialStateRef = useRef(initialState);

  // draft 로드는 useEffect에서만 (localStorage는 클라이언트 전용 → 렌더 중 읽으면 hydration mismatch)
  useEffect(() => {
    const draft = persistKey ? getDraftSync(persistKey) : null;
    const resolvedState =
      draft?.state && Object.keys(draft.state).length > 0
        ? { ...initialStateRef.current, ...draft.state }
        : initialStateRef.current;
    const resolvedStepIndex =
      draft && draft.stepIndex >= 0 && draft.stepIndex < stepsRef.current.length
        ? draft.stepIndex
        : initialStepIndex ?? 0;

    const queryStep = syncWithQuery ? searchParams.get(resolvedQueryKey) : null;
    const queryStepIndex = queryStep
      ? stepsRef.current.indexOf(queryStep)
      : -1;
    const resolvedIndex =
      queryStepIndex >= 0 ? queryStepIndex : resolvedStepIndex;

    initFunnel(key, stepsRef.current, resolvedState, resolvedIndex);

    if (
      syncWithQuery &&
      queryStepIndex < 0 &&
      resolvedStepIndex > 0
    ) {
      const stepName = stepsRef.current[resolvedIndex];
      if (stepName) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(resolvedQueryKey, stepName);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  }, [key, persistKey, initialStepIndex, syncWithQuery, resolvedQueryKey, searchParams, pathname, router, initFunnel]);

  // ─── destroyOnUnmount ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      // 언마운트 시 store에서 funnel 제거
      // destroyOnUnmount: false면 페이지 이동 후 돌아와도 상태 유지
      if (destroyOnUnmount) destroy(key);
    };
  }, [key, destroyOnUnmount, destroy]);

  // ─── Derived state ──────────────────────────────────────────────────────────
  // funnel 초기화 전(첫 렌더)에는 initialState 사용 (SSR/클라이언트 동일 → hydration 안전)
  const currentStepIndex =
    funnel?.currentStepIndex ?? initialStepIndex ?? 0;
  const state = funnel?.state ?? initialState;
  const stepHistory = useMemo(
    () => funnel?.stepHistory ?? [],
    [funnel?.stepHistory]
  );
  const canGoPrev = stepHistory.length > 0;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const currentStep = useMemo(
    () => (steps[currentStepIndex] ?? steps[0]) as StepType<S>,
    [steps, currentStepIndex]
  );

  // ─── URL query 업데이트 헬퍼 ────────────────────────────────────────────────
  const updateQuery = useCallback(
    (stepIndex: number) => {
      if (!syncWithQuery) return;

      const stepName = steps[stepIndex];
      if (!stepName) return;

      // 기존 쿼리 파라미터를 유지하면서 현재 step만 교체
      // ex) ?foo=bar&signup=email → ?foo=bar&signup=password
      const params = new URLSearchParams(searchParams.toString());
      params.set(resolvedQueryKey, stepName);

      // router.push 대신 replace를 쓰는 이유:
      // push는 history 스택에 URL이 쌓여서 브라우저 뒤로가기 시 URL만 바뀌고
      // store의 step은 안 바뀌는 불일치가 발생함
      // replace는 현재 URL만 교체하므로 history 스택이 안 쌓힘
      // 뒤로가기는 back()에서 직접 처리
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [syncWithQuery, steps, resolvedQueryKey, searchParams, pathname, router]
  );

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (isLastStep) return;

    next(key);

    // currentStepIndex는 현재 클로저에서 캡처된 값이므로
    // store에서 읽지 않고 currentStepIndex + 1로 직접 계산
    updateQuery(currentStepIndex + 1);
  }, [key, next, isLastStep, currentStepIndex, updateQuery]);

  const handleBack = useCallback(
    (onExit?: () => void) => {
      if (canGoPrev) {
        prev(key);

        // stepHistory의 마지막 값이 돌아갈 index
        const prevIndex = stepHistory[stepHistory.length - 1];
        updateQuery(prevIndex);
      } else {
        // 첫 step에서 뒤로가기 → 퍼널 밖으로 이탈
        // ex) onExit: () => router.back() 으로 이전 페이지로 이동
        onExit?.();
      }
    },
    [canGoPrev, prev, key, stepHistory, updateQuery]
  );

  const handleSetStep = useCallback(
    (step: StepType<S>) => {
      const stepIndex = steps.indexOf(step);

      // steps에 없는 값이 들어오면 무시
      if (stepIndex < 0) return;

      setStoreStep(key, stepIndex);
      updateQuery(stepIndex);
    },
    [steps, key, setStoreStep, updateQuery]
  );

  const handleSetState = useCallback(
    (partial: Partial<T> | ((prev: T) => T)) => {
      setStoreState(
        key,
        partial as Partial<unknown> | ((prev: unknown) => unknown)
      );
    },
    [key, setStoreState]
  );

  // persistKey 있으면 state/step 변경 시 자동으로 zustand persist (별도 draft 저장 없음)
  useEffect(() => {
    if (!persistKey || !funnel) return;
    useFunnelPersistStore
      .getState()
      .setDraft(
        persistKey,
        funnel.state as Record<string, unknown>,
        funnel.currentStepIndex
      );
  }, [persistKey, funnel]);

  const handleReset = useCallback(() => {
    reset(key);
    // reset 시 URL도 첫 step으로 복귀
    updateQuery(0);
  }, [key, reset, updateQuery]);

  const clearPersistedDraft = useCallback(() => {
    if (persistKey) useFunnelPersistStore.getState().clearDraft(persistKey);
  }, [persistKey]);

  // ─── Return ─────────────────────────────────────────────────────────────────
  return {
    currentStep,
    currentStepIndex,
    state,
    steps,
    canGoPrev,
    isFirstStep,
    isLastStep,
    setState: handleSetState,
    next: handleNext,
    back: handleBack,
    reset: handleReset,
    setStep: handleSetStep,
    ...(persistKey && { clearPersistedDraft }),
  };
}

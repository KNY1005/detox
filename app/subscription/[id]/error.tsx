"use client";

import ErrorScreen from "@/app/components/error-screen";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  return <ErrorScreen error={error} reset={reset} />;
}

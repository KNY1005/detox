"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/users";

export function useCurrentAuthUser() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        if (error) {
          console.error(error);
          setIsError(true);
          return;
        }

        setCurrentUserId(user?.id ?? null);
        setIsError(false);
      } catch (currentUserError) {
        if (!isMounted) {
          return;
        }

        console.error(currentUserError);
        setIsError(true);
      } finally {
        if (isMounted) {
          setIsPending(false);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    currentUserId,
    isPending,
    isError,
  };
}

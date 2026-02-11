import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setError } from "@/app/store/slices/errorSlice";
import { useCallback } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

/**
 * Hook to handle 404 responses from API calls
 * Redirects to /access-denied or /not-found based on status
 * For use in pages where entity IDs may not exist
 */
export const useHandle404 = () => {
  const router = useRouter();
  return useCallback(
    (error: FetchBaseQueryError | SerializedError | undefined) => {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        typeof error.status === "number"
      ) {
        if (error.status === 404) {
          router.push("/not-found");
          return true;
        }
        if (error.status === 403) {
          router.push("/access-denied");
          return true;
        }
      }
      return false;
    },
    [router],
  );
};

/**
 * Hook to show error modal for 403 action errors
 * Use when a button/mutation returns 403 (user not allowed to perform action)
 */
export const useShowActionForbiddenError = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(
      setError({
        errorType: "403",
        message: "You are not allowed to perform this action",
      }),
    );
  }, [dispatch]);
};

/**
 * Hook to show server error banner
 * Use for 5xx errors
 */
export const useShowServerError = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(
      setError({
        errorType: "5xx",
        message: "Something went wrong. Please try again later.",
      }),
    );
  }, [dispatch]);
};

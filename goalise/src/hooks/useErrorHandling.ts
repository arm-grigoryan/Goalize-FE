import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setError } from "@/app/store/slices/errorSlice";
import { useCallback } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

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

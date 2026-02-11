import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ErrorType = "403" | "5xx" | null;

export interface ErrorState {
  errorType: ErrorType;
  message: string;
  visible: boolean;
}

const initialState: ErrorState = {
  errorType: null,
  message: "",
  visible: false,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (
      state,
      action: PayloadAction<{
        errorType: ErrorType;
        message: string;
      }>,
    ) => {
      state.errorType = action.payload.errorType;
      state.message = action.payload.message;
      state.visible = true;
    },
    clearError: (state) => {
      state.errorType = null;
      state.message = "";
      state.visible = false;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;

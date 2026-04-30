import { createSlice } from "@reduxjs/toolkit";

const eventsSlice = createSlice({
  name: "events",
  initialState: { refreshKey: 0 },
  reducers: {
    invalidateEventsList: (state) => {
      state.refreshKey += 1;
    },
  },
});

export const { invalidateEventsList } = eventsSlice.actions;
export default eventsSlice.reducer;

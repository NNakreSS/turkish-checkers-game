import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    
};
const reducers = {};

const checkersSlice = createSlice({
  name: "checkers",
  initialState,
  reducers,
});

export const checkersSelector = (state) => state.checkers;
export default checkersSlice.reducer;

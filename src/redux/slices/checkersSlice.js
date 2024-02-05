import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const checkersEntityAdapter = createEntityAdapter();

const initialState = () =>
  checkersEntityAdapter.getInitialState({
    forcedPieces: [],
    turnColor: "white",
    capturePieces: {
      black: 0,
      white: 0,
    },
    winner: null,
  });

const reducers = {
  addPieces: checkersEntityAdapter.addMany,
  removePieces: checkersEntityAdapter.removeAll,
  updatePiece: checkersEntityAdapter.updateOne,
  updatePieces: checkersEntityAdapter.updateMany,
  setForcedPiece(state, { payload }) {
    state.forcedPieces = payload;
  },
  toggleTurnColor(state) {
    state.turnColor = state.turnColor == "white" ? "black" : "white";
  },
  capturePiece(state, { payload }) {
    state.capturePieces[payload] += 1;
    if (state.capturePieces[payload] == 16) state.winner = payload;
  },
  resetGameSates() {
    return initialState();
  },
};

const checkersSlice = createSlice({
  name: "checkers",
  initialState,
  reducers,
});

export const checkerAdapterSelector = checkersEntityAdapter.getSelectors(
  (state) => state.checkers
);

export const checkersSelector = (state) => state.checkers;

export default checkersSlice.reducer;
export const {
  addPieces,
  removePiece,
  updatePiece,
  updatePieces,
  setForcedPiece,
  toggleTurnColor,
  capturePiece,
  resetGameSates,
} = checkersSlice.actions;

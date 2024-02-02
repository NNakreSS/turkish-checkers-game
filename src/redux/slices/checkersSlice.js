import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { createGameBoard } from "../../utilities/utilitie";

const checkersEntityAdapter = createEntityAdapter();

const initialState = () =>
  checkersEntityAdapter.getInitialState({
    Squares: createGameBoard(),
    forcedPieces: [],
    turnColor: "white",
  });

const reducers = {
  addPieces: checkersEntityAdapter.addMany,
  removePiece: checkersEntityAdapter.removeOne,
  updatePiece: checkersEntityAdapter.updateOne,
  updatePieces: checkersEntityAdapter.updateMany,
  setForcedPiece(state, { payload }) {
    state.forcedPieces = payload;
  },
  toggleTurnColor(state) {
    state.turnColor = state.turnColor == "white" ? "black" : "white";
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
} = checkersSlice.actions;

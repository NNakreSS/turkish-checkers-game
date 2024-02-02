import { nanoid } from "@reduxjs/toolkit";

// create array for game table block
export const createGameBoard = () => {
  const array_row = new Array(8).fill().map((x, i) => 8 - i); // create cols array from 1 to 8

  const array_col = new Array(8).fill().map((x, i) => ++i); // create rows array from a to h

  return {
    cols: array_col,
    rows: array_row,
  };
};

export const getCharFromCode = (i) => String.fromCharCode(i + 96); // Char code üzezrinden harfleri getirir 97 -> a ile başlar.

// create Pieces black and white
export const createPieces = () => {
  const createCoordBlack = (i) =>
    i <= 8 ? i + "/6" : (i % 8 == 0 ? 8 : i % 8) + "/7";
  const createCoordWhite = (i) =>
    i <= 8 ? i + "/2" : (i % 8 == 0 ? 8 : i % 8) + "/3";

  const black = new Array(16).fill().map((x, i) => ({
    id: nanoid(),
    coord: createCoordBlack(++i),
    type: "black",
    king: false,
  }));

  const white = new Array(16).fill().map((x, i) => ({
    id: nanoid(),
    coord: createCoordWhite(++i),
    type: "white",
    king: true,
  }));
  return [...black, ...white];
};

// check coord on piece ?
export const isPlacePieceOnCoord = (coord, pieces) => {
  const onBoardPieces = pieces.filter((piece) => piece.coord === coord)[0];
  return onBoardPieces;
};

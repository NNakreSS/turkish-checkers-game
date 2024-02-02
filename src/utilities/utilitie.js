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
    king: false,
  }));
  return [...black, ...white];
};

// check coord on piece ?
export const isPlacePieceOnCoord = (coord, pieces) => {
  const onBoardPieces = pieces.find((piece) => piece.coord === coord);
  return onBoardPieces;
};

export const getAcceptRottaionArray = ({ type, coord }) => {
  const forwardType = type == "white" ? +1 : -1;
  const [col, row] = coord.split("/").map(Number);
  const right = col < 8 ? `${col + 1}/${row}` : null;
  const left = col > 1 ? `${col - 1}/${row}` : null;
  const forward = `${col}/${row + forwardType}`;
  const rotationArray = [forward, left, right].filter((item) => item);
  return rotationArray;
};

///// game contoller
export const checkCanDrop = ({ coord, squareCoord, type, pieces }) => {
  const rotationArray = getAcceptRottaionArray({ type, coord });
  // Kontrol edilecek taş türüne göre düşman ve kendi taşlarını seç
  const ownPieces = pieces.filter((piece) => piece.type === type);
  const enemyPieces = pieces.filter((piece) => piece.type !== type);

  // Hareketin kabul edilebilir olduğunu kontrol et
  const acceptableRotations = rotationArray.filter((rotation) =>
    ownPieces.every((piece) => piece.coord !== rotation)
  );

  // hamle yapacak boş kare yoksa false dön
  if (acceptableRotations.length == 0) return false;

  // Yakındaki düşman taşları kontrol et
  const closestEnemyCoords = [];
  acceptableRotations.forEach((rotation) => {
    const closestEnemy = enemyPieces.find((piece) => piece.coord === rotation);
    if (closestEnemy) {
      const [eCol, eRow] = rotation.split("/").map(Number);
      const col = Number(rotation.split("/")[0]);
      const forwardType = type == "white" ? +1 : -1;
      const newRotation =
        eCol === col
          ? `${eCol}/${eRow + forwardType}`
          : `${eCol > col ? eCol + 1 : eCol - 1}/${eRow}`;
      const isNotFreeBehindEnemy = enemyPieces.some(
        (piece) => piece.coord === newRotation
      );
      if (!isNotFreeBehindEnemy) {
        closestEnemyCoords.push(newRotation);
      }
    }
  });
  // Eğer yakında bir düşman varsa, sadece ona hamle yapabilirsin
  if (closestEnemyCoords.length > 0) {
    return closestEnemyCoords.includes(squareCoord);
  } else {
    return acceptableRotations.includes(squareCoord);
  }
};

////

export const isPieceCanMove = (pieces, piece) => {
  if (!piece.king) {
    const forwardType = piece.type == "white" ? +1 : -1;
    const own_pieces =
      piece.type == "white"
        ? pieces.filter((piece) => piece.type === "white")
        : pieces.filter((piece) => piece.type === "black");

    const [col, row] = piece.coord.split("/").map(Number);
    const right = col < 8 ? `${col + 1}/${row}` : null;
    const left = col > 1 ? `${col - 1}/${row}` : null;
    const forward = `${col}/${row + forwardType}`;
    const rotationArray = [forward, left, right].filter((item) => item);
    // Check if the square is empty
    const acceptableRotations = rotationArray.some((rotation) =>
      own_pieces.every((piece) => piece.coord !== rotation)
    );
    return acceptableRotations;
  }
};

/// check force piece

export const checkForcePiece = (type, pieces) => {
  const ownPieces = pieces.filter((piece) => piece.type == type);
  const enemyPiece = pieces.filter((piece) => piece.type != type);

  ownPieces.forEach((piece) => {
    if (!piece.king) {
      // Check if the square is empty
      const acceptableRotations = rotationArray.filter((rotation) =>
        enemyPiece.every((ePiece) => ePiece.coord == rotation)
      );

      if (acceptableRotations.length > 0) {
        acceptableRotations.forEach((ePiece) => {});
      }
    }
  });
};

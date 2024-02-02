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

//// game contoller
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

      const col = Number(coord.split("/")[0]);

      const forwardType = type == "white" ? +1 : -1;
      const newRotation =
        eCol === col
          ? `${eCol}/${eRow + forwardType}`
          : `${eCol > col ? eCol + 1 : eCol - 1}/${eRow}`;

      const isNotFreeBehindEnemy = enemyPieces.some(
        (piece) => piece.coord === newRotation
      );
      const isNotFreeBehindOwned = ownPieces.some(
        (piece) => piece.coord === newRotation
      );

      if (!isNotFreeBehindEnemy && !isNotFreeBehindOwned) {
        closestEnemyCoords.push(newRotation);
      }
    }
  });
  // Eğer yakında bir düşman varsa, sadece ona hamle yapabilirsin
  if (closestEnemyCoords.length > 0) {
    return closestEnemyCoords.includes(squareCoord);
  } else {
    // gidilebilir alanlardan herhangi biri test edilen kareye aitse ve o kare üzerinde rakip taşı yoksa
    return acceptableRotations.some(
      (square) =>
        square == squareCoord &&
        !enemyPieces.some((piece) => piece.coord === squareCoord)
    );
  }
};

////

export const isPieceCanMove = (pieces, { king, type, coord }) => {
  if (!king) {
    const own_pieces = pieces.filter((piece) => piece.type === type);
    const rotationArray = getAcceptRottaionArray({ type, coord });
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
  const enemyPieces = pieces.filter((piece) => piece.type != type);
  const forcedPieces = [];
  for (const { king, type, coord, id } of ownPieces) {
    if (!king) {
      const rotationArray = getAcceptRottaionArray({ type, coord });
      const closesetEnemys = rotationArray.filter((rotation) =>
        enemyPieces.some((ePiece) => ePiece.coord == rotation)
      );

      if (closesetEnemys.length > 0) {
        const col = Number(coord.split("/")[0]);
        for (const ePiece of closesetEnemys) {
          const forwardType = type == "white" ? +1 : -1;
          const [eCol, eRow] = ePiece.split("/").map(Number);

          const rowRotation =
            eRow + forwardType <= 8 &&
            eRow + forwardType >= 1 &&
            `${eCol}/${eRow + forwardType}`;

          const colRotation =
            eCol + 1 <= 8 &&
            eCol - 1 >= 1 &&
            `${eCol > col ? eCol + 1 : eCol - 1}/${eRow}`;

          const newRotation = eCol === col ? rowRotation : colRotation;
          if (newRotation) {
            const isNotFreeBehindEnemy = enemyPieces.some(
              (piece) => piece.coord === newRotation
            );
            const isNotFreeBehindOwned = ownPieces.some(
              (piece) => piece.coord === newRotation
            );

            if (!isNotFreeBehindOwned && !isNotFreeBehindEnemy) {
              forcedPieces.push(id);
            }
          }
        }
      }
    }
  }
  return forcedPieces;
};

// üzerinden atlanan rakip taşın tespiti

export const checkRemovePiece = (coord, squareCoord, pieces) => {
  const [cCol, cRow] = coord.split("/").map(Number);
  const [nCol, nRow] = squareCoord.split("/").map(Number);
  let spacedSquareCoord = null;
  if (cCol == nCol) {
    const diff = cRow - nRow;
    const nextRow = cRow + (diff < 0 ? +1 : -1);
    if (Math.abs(diff) > 1) {
      spacedSquareCoord = `${cCol}/${nextRow}`;
    }
  } else {
    const diff = cCol - nCol;
    const nextCol = cCol + (diff < 0 ? +1 : -1);
    if (Math.abs(diff) > 1) {
      spacedSquareCoord = `${nextCol}/${cRow}`;
    }
  }
  console.log(spacedSquareCoord);
  const removePiece = pieces.find((piece) => piece.coord === spacedSquareCoord);
  return removePiece?.id;
};

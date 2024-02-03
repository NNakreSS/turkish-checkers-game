import { nanoid } from "@reduxjs/toolkit";
import Store from "../redux/Store";

/**
 *
 * @returns array[{id:"1/1" , piece:null}, ..... {"2/1" , piece:{type:white , king:false}}]
 */
export const createGameBoard = () => {
  // (8..,..1) elemanlarına sahip iki array oluştururuz (oyun 8x8 tahta üzerinde olduğundan bu array stün ve kolonları oluşturacak)
  const colsArray = new Array(8).fill().map((x, i) => ++i); // [1,2,....,8]
  //! ilk kare 1/8 yani kolon 1 satır 8 i ifade edeceği için colonlar 1 den başlarken satırlar 8 den başlar
  const rowsArray = new Array(8).fill().map((x, i) => 8 - i); // [8,7,....,1]
  const gameSquares = [];
  /**
   * array üzerinde gezienerek her stün için 8 adet satır oluşturup içerisine başlangıç için oyun taşlarını yerleştiririz.
   * oyunda beyaz taşlar 2 ve 3. satırlara , siyah taşlar 6 ve 7. sütunlara yerleştirilir
   * */
  for (const row of rowsArray) {
    for (const col of colsArray) {
      // colon ve stünları coord olarak belirler ve / ile ayırarak bir string oluştururuz ["1/1" , "1/2" ,...]
      const coord = `${col}/${row}`;
      // oyun taşlarını satırlara göre oluştururuz
      const piece =
        row == 2 || row == 3
          ? { type: "white", king: false, square: coord, id: nanoid() }
          : row == 6 || row == 7
          ? { type: "black", king: false, square: coord, id: nanoid() }
          : null;

      const square = { id: coord, piece };
      // oluşturduğumuz kareyi oyun karelerine ekleriz
      gameSquares.push(square);
    }
  }
  return gameSquares;
};

// // create Pieces black and white
// export const createPieces = () => {
//   const createCoordBlack = (i) =>
//     i <= 8 ? i + "/6" : (i % 8 == 0 ? 8 : i % 8) + "/7";
//   const createCoordWhite = (i) =>
//     i <= 8 ? i + "/2" : (i % 8 == 0 ? 8 : i % 8) + "/3";

//   const black = new Array(16).fill().map((x, i) => ({
//     id: nanoid(),
//     coord: createCoordBlack(++i),
//     type: "black",
//     king: false,
//   }));

//   const white = new Array(16).fill().map((x, i) => ({
//     id: nanoid(),
//     coord: createCoordWhite(++i),
//     type: "white",
//     king: false,
//   }));
//   return [...black, ...white];
// };

// // check coord on piece ?
// export const isPlacePieceOnCoord = (coord, pieces) => {
//   const onBoardPieces = pieces.find((piece) => piece.coord === coord);
//   return onBoardPieces;
// };

const isFreeSquare = (ownPieces, col, row) => {
  const squareCoord = `${col}/${row}`;
  const _hitOwnPiece = ownPieces.some(
    ([, square]) => square.piece?.square == squareCoord
  );
  return _hitOwnPiece ? false : squareCoord;
};

// gidebileceği karelerin kordinatları
export const getAcceptRottaionArray = (
  { type, square: coord, king },
  ownPieces
) => {
  let rotationArray;
  const [col, row] = coord.split("/").map(Number);
  if (!king) {
    const forwardType = type == "white" ? +1 : -1;
    const right = col < 8 ? `${col + 1}/${row}` : null;
    const left = col > 1 ? `${col - 1}/${row}` : null;
    const forward = `${col}/${row + forwardType}`;
    rotationArray = [forward, left, right].filter((item) => item);
  } else {
    rotationArray = [];
    for (let iCol = col + 1; iCol < 9; iCol++) {
      const square = isFreeSquare(ownPieces, iCol, row);
      if (!square) break;
      rotationArray.push(square);
    }
    for (let iCol = col - 1; iCol > 0; iCol--) {
      const square = isFreeSquare(ownPieces, iCol, row);
      if (!square) break;
      rotationArray.push(square);
    }
    for (let iRow = row + 1; iRow < 9; iRow++) {
      const square = isFreeSquare(ownPieces, col, iRow);
      if (!square) break;
      rotationArray.push(square);
    }
    for (let iRow = row - 1; iRow > 0; iRow--) {
      const square = isFreeSquare(ownPieces, col, iRow);
      if (!square) break;
      rotationArray.push(square);
    }
  }
  return rotationArray;
};

//// game contoller
// export const checkCanDrop = ({ coord, squareCoord, type, pieces, king }) => {
//   // Kontrol edilecek taş türüne göre düşman ve kendi taşlarını seç
//   const ownPieces = pieces.filter((piece) => piece.type === type);
//   const enemyPieces = pieces.filter((piece) => piece.type !== type);

//   const rotationArray = getAcceptRottaionArray({
//     type,
//     coord,
//     king,
//     ownPieces,
//   });

//   // Hareketin kabul edilebilir olduğunu kontrol et
//   let acceptableRotations = king
//     ? rotationArray
//     : rotationArray.filter((rotation) =>
//         ownPieces.every((piece) => piece.coord !== rotation)
//       );

//   // hamle yapacak boş kare yoksa false dön
//   if (acceptableRotations?.length == 0) return false;

//   // Yakındaki düşman taşları kontrol et
//   const closestEnemyCoords = [];
//   acceptableRotations.forEach((rotation) => {
//     const closestEnemy = enemyPieces.find((piece) => piece.coord === rotation);
//     if (closestEnemy) {
//       const [eCol, eRow] = rotation.split("/").map(Number);

//       const [col, row] = coord.split("/").map(Number);

//       const forwardType = eRow > row ? +1 : -1;
//       const newRotation =
//         eCol === col
//           ? `${eCol}/${eRow + forwardType}`
//           : `${eCol > col ? eCol + 1 : eCol - 1}/${eRow}`;

//       const isNotFreeBehindEnemy = enemyPieces.some(
//         (piece) => piece.coord === newRotation
//       );
//       const isNotFreeBehindOwned = ownPieces.some(
//         (piece) => piece.coord === newRotation
//       );

//       if (!isNotFreeBehindEnemy && !isNotFreeBehindOwned) {
//         closestEnemyCoords.push(newRotation);
//       }
//     }
//   });
//   // Eğer yakında bir düşman varsa, sadece ona hamle yapabilirsin
//   if (closestEnemyCoords.length > 0) {
//     return closestEnemyCoords.includes(squareCoord);
//   } else {
//     // gidilebilir alanlardan herhangi biri test edilen kareye aitse ve o kare üzerinde rakip taşı yoksa
//     return acceptableRotations.some(
//       (square) =>
//         square == squareCoord &&
//         !enemyPieces.some((piece) => piece.coord === squareCoord)
//     );
//   }
// };

// hamle için seçtiğim taşın hamle yapabileceği bir kare var mı
export const pieceMoveSquares = (selectedPiece) => {
  const squares = Store.getState().checkers.entities;
  const movedSquares = [];
  const movedEnemySquares = [];
  const ownPiecesSquare = getOwnPiecesSquareFromObjectArray(
    squares,
    selectedPiece.type
  );
  if (!selectedPiece.king) {
    const col = Number(selectedPiece.square.split("/")[0]); // hamle yapılmak üzere seçilen taşın colonu
    const rotations = getAcceptRottaionArray(selectedPiece, ownPiecesSquare);
    for (const rotation of rotations) {
      // hamle yapabileceğim karelerin tamamını tek tek dolaş
      const squarePiece = squares[rotation]?.piece; // hamle mesafemdeki karenin içerisindeki taş
      if (!squarePiece) {
        // hamle mesafemin içerisindeki karede hiç taş yoksa
        movedSquares.push(rotation);
      } else if (squarePiece.type !== selectedPiece.type) {
        // hamle mesafemin içerisinde rakip taşı varsa , arkasındaki kare boş mu onu kontrol et
        const [eCol, eRow] = squarePiece.square.split("/").map(Number); // denk geldiğin rakip taşın kordinatını al
        const forwardType = selectedPiece.type == "white" ? +1 : -1;
        // rakip taşın arkasınındaki karenin kordinatını alıyoruz
        const enemyBehind =
          eCol === col
            ? `${eCol}/${eRow + forwardType}` // aynı kolondaysak , rakibin bir arkasındaki satırı seç
            : `${eCol > col ? eCol + 1 : eCol - 1}/${eRow}`; // aynı satırdaysak , rakibin bir arkasındaki kolonu seç

        // seçilen yeni karede bir taş var mı;
        if (!squares[enemyBehind]?.piece) {
          // seçilen yeni karede hiçbir taş yoksa hamle yapılabilir
          movedEnemySquares.push(enemyBehind);
        }
      }
    }
  }
  const accesSquares =
    movedEnemySquares.length > 0 ? movedEnemySquares : movedSquares; // düşman taşını yiyebileceğin bir hamle varsa sadece o karelere hamle yapabilirsin taşı yemek zorundasın
  return accesSquares;
};

// /// check force piece
// export const checkForcePiece = (type, pieces) => {
//   const ownPieces = pieces.filter((piece) => piece.type == type);
//   const enemyPieces = pieces.filter((piece) => piece.type != type);
//   let forcedPieces = [];
//   for (const { king, type, coord, id } of ownPieces) {
//     if (!king) {
//       forcedPieces.push(
//         checkForce({ type, coord, id }, enemyPieces, ownPieces)
//       );
//     }
//   }
//   forcedPieces = forcedPieces.filter((item) => item);
//   return forcedPieces;
// };

// ///
// export const checkForce = ({ type, coord, id }, enemyPieces, ownPieces) => {
//   const rotationArray = getAcceptRottaionArray({ type, coord, ownPieces });
//   const closesetEnemys = rotationArray.filter((rotation) =>
//     enemyPieces.some((ePiece) => ePiece.coord == rotation)
//   );

//   if (closesetEnemys.length > 0) {
//     const col = Number(coord.split("/")[0]);
//     for (const ePiece of closesetEnemys) {
//       const forwardType = type == "white" ? +1 : -1;
//       const [eCol, eRow] = ePiece.split("/").map(Number);

//       const rowRotation =
//         eRow + forwardType <= 8 &&
//         eRow + forwardType >= 1 &&
//         `${eCol}/${eRow + forwardType}`;

//       const colRotation =
//         eCol + 1 <= 8 &&
//         eCol - 1 >= 1 &&
//         `${eCol > col ? eCol + 1 : eCol - 1}/${eRow}`;

//       const newRotation = eCol === col ? rowRotation : colRotation;
//       if (newRotation) {
//         const isNotFreeBehindEnemy = enemyPieces.some(
//           (piece) => piece.coord === newRotation
//         );
//         const isNotFreeBehindOwned = ownPieces.some(
//           (piece) => piece.coord === newRotation
//         );

//         if (!isNotFreeBehindOwned && !isNotFreeBehindEnemy) {
//           return id;
//         }
//       }
//     }
//   }
// };

/// üzerinden atlanan rakip taşın tespiti
export const spacedSquares = (droppedPiece, squareCoord) => {
  const [pCol, pRow] = droppedPiece.square.split("/").map(Number); // hamle yapılmadan önceki konum
  const [nCol, nRow] = squareCoord.split("/").map(Number); // hamlel yapıldıktan sonraki yeni kodum
  const spacedSquareCoord = [];
  if (pCol == nCol) {
    // hala aynı kolondaysak , satır değiştirmişizdir
    const diff = pRow - nRow; // satırlar arasındaki fark
    const distance = Math.abs(diff); // satırlar arasındaki mesafe
    const nextRow = pRow + (diff < 0 ? +1 : -1); //
    /**
     * bir kareden fazla kare ileri hamle yapıldıysa bir taşın üzerinden atlanılmıştır ,
     * üzerinden atlanılan karenin kordinatını al
     *  */
    if (distance > 1) spacedSquareCoord.push(`${pCol}/${nextRow}`);
  } else {
    // hala aynı kolonda değil aynı satırdaysa , kolonumuz değişmiştir
    const diff = pCol - nCol; // kolonlar arasındaki fark
    const distance = Math.abs(diff); // kolonlar arasındaki mesafe
    const nextCol = pCol + (diff < 0 ? +1 : -1);
    /**
     * bir kareden fazla kare ileri hamle yapıldıysa bir taşın üzerinden atlanılmıştır ,
     * üzerinden atlanılan karenin kordinatını al
     *  */
    if (distance > 1) spacedSquareCoord.push(`${nextCol}/${pRow}`);
  }
  return spacedSquareCoord;
};

// taş yeme zorunluluğunu kontrol eder , bu hamleye zorunlu bir taş varsa o taşın id sini içeren dizi dönderir
export const eatingRequirementPiecesCheck = (piece) => {
  const squares = Store.getState().checkers.entities;
  const eatingPieces = [];
  const ownPieceSquares = getOwnPiecesSquareFromObjectArray(
    squares,
    piece.type
  ); // aynı tipte taşları içeren tüm kareleri alır
  ownPieceSquares.forEach(([, squareValue]) => {
    const forced = eatingRequirementPieceCheck(
      squareValue.piece,
      ownPieceSquares
    );
    forced && eatingPieces.push(forced);
  });
  return eatingPieces;
};

// tek bir taş için taş yeme zorunluluğunu kontrol eder , bu hamleye zorunlu bir taş varsa o taşın id sini dönderir
export const eatingRequirementPieceCheck = (piece) => {
  const squares = Store.getState().checkers.entities;
  const ownPieceSquares = getOwnPiecesSquareFromObjectArray(
    squares,
    piece.type
  ); // aynı tipte taşları içeren tüm kareleri alır

  const col = Number(piece.square.split("/")[0]);
  // karelerin hepsini tek tek gez
  const rotations = getAcceptRottaionArray(piece, ownPieceSquares); // karenin içerisindeki taşın gidebileceği kareleri al
  for (const rotation of rotations) {
    // hamle yapabileceğim karelerin tamamını tek tek dolaş
    const squarePiece = squares[rotation]?.piece; // hamle mesafemdeki karenin içerisindeki taş
    if (squarePiece) {
      if (squarePiece.type !== piece.type) {
        // hamle mesafemin içerisinde rakip taşı varsa , arkasındaki kare boş mu onu kontrol et
        const [eCol, eRow] = squarePiece.square.split("/").map(Number); // denk geldiğin rakip taşın kordinatını al
        const forwardType = piece.type == "white" ? +1 : -1;
        // rakip taşın arkasınındaki karenin kordinatını alıyoruz
        const enemyBehind =
          eCol === col
            ? `${eCol}/${eRow + forwardType}` // aynı kolondaysak , rakibin bir arkasındaki satırı seç
            : `${eCol > col ? eCol + 1 : eCol - 1}/${eRow}`; // aynı satırdaysak , rakibin bir arkasındaki kolonu seç

        // seçilen yeni karede bir taş var mı;
        if (!squares[enemyBehind]?.piece) {
          // seçilen yeni karede hiçbir taş yoksa hamle yapılabilir
          return piece.id;
        }
      }
    }
  }
};

export const getOwnPiecesSquareFromObjectArray = (type) => {
  const squares = Store.getState().checkers.entities;
  const ownPieces = Object.entries(squares).filter(([, squareValue]) => {
    const squarePice = squareValue.piece;
    return squarePice?.type === type;
  });

  return ownPieces;
};

export const getEnemyPiecesSquareFromObjectArray = (type) => {
  const squares = Store.getState().checkers.entities;
  const ownPieces = Object.entries(squares).filter(([, squareValue]) => {
    const squarePice = squareValue.piece;
    return squarePice?.type !== type;
  });

  return ownPieces;
};

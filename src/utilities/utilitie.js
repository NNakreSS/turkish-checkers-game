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

// hamle mesafesindeki karelerin hamle yapılmaya uygunluğunu kontrol et ve false yada hamle yapılabilir karenin kordinatını , ve taş yeme hamlesi olup olmadığını içeren bir obje dön
const isFreeSquare = (type, col, row, rotType) => {
  const ownPieces = getOwnPiecesSquareFromObjectArray(type); // dost taşlar
  const enemyPieces = getEnemyPiecesSquareFromObjectArray(type); // rakip taşlar
  const squareCoord = `${col}/${row}`; // kontrol edilecek olan karenin kordinatı
  // kontrol edilen karede varsa dost taşı
  const hitOwnPiece = ownPieces.some(
    ([, square]) => square.piece?.square == squareCoord
  );
  if (hitOwnPiece) return false; // gidebileceği karede kendi taşı varsa gidemez

  // kotnrol edilen karede varsa rakip taşı
  const hitEnemeyPiece = enemyPieces.some(
    ([, square]) => square.piece?.square == squareCoord
  );

  // kontrol edilen karede bir rakip taş varsa
  if (hitEnemeyPiece) {
    // rakip taşın arkasındaki kare boş mu dolu mu , bunu için o karenin bilgilerini al
    let enemyBehind =
      rotType === "up" // kontrol edilen hame yönü yukarı doğruysa
        ? row < 8 && `${col}/${row + 1}`
        : rotType === "down" // kontrol edilen hame yönü aşağı doğruysa
        ? row > 1 && `${col}/${row - 1}`
        : rotType === "right" // kontrol edilen hame yönü sağa doğruysa
        ? col < 8 && `${col + 1}/${row}`
        : col > 1 && `${col - 1}/${row}`; //hamle yönü diğerlerinden bitrisi değilse sola ddoğrudur

    if (!enemyBehind) return false; // rakipt taş köşe sınırlardaysa arkasında gidilebilecek bir nokta yok demektir
    // tespit edilen rakip taşının arkasında varsa dost taşı
    const _hitOwnPiece = ownPieces.some(
      ([, square]) => square.piece?.square == enemyBehind
    );
    if (_hitOwnPiece) return false; // rakip taşın arkasında kendi taşımız varsa hamle yapılamaz hamle devam edemez

    // tespit edilen rakip taşın arkasında varsa başka bir rakip taş
    const _hitEnemeyPiece = enemyPieces.some(
      ([, square]) => square.piece?.square == enemyBehind
    );

    if (_hitEnemeyPiece) {
      return false; // rakip taşın arkasında yine bir rakip taş varsa hamle yapılamaz hamle devam edemez
    } else {
      // rakip taşın arkasındaki kordinatta kendi taşımız ve rakip taş yoksa o kordinatı dön
      return { coord: enemyBehind, capture: true };
    }
  }

  return { coord: squareCoord, capture: false }; // ne dost ne rakip taşı varsa kare hamle yapılabilir kareyi dön , taş yenmeyen bir hamledir
};

// gidebileceği karelerin kordinatları
export const getAcceptRottaionArray = ({ type, square: coord, king }) => {
  let rotationArray = [];
  const [col, row] = coord.split("/").map(Number);
  // hamle yapılacak olan taş bir dama taşı mı
  if (!king) {
    // dama taşı değilse gidebileceği 3 rotasyonu al ve kontrol et
    const forwardNumber = type == "white" ? +1 : -1;
    const right = col < 8 ? [col + 1, row] : null;
    const left = col > 1 ? [col - 1, row] : null;
    const forward = [col, row + forwardNumber];
    rotationArray = [forward, right, left] // hamle yapılabilir olan karelerin kordinatlarını array haline getirip map ediyoruz
      .map((rotation, index) => {
        if (!rotation) return null; // o rotasyon yoksa null değerini dön
        const [tcol, trow] = rotation; // rotasyon varsa kolon ve satır değerlerini al
        const rotType = // rotasyonun yön tipini belirle
          index == 0 // ilk rotasyon için (ileri rotasyonu)
            ? type == "white" // taş tipi beyaz taş ise
              ? "up" // ileri rotasyonu yukarı doğru
              : "down" // ileri rotasyonu aşağı doğru
            : index == 1 // 2. rotasyon için (sağ rotasyonu)
            ? "right" // rosayton tipi sağ
            : "left"; // 3. index için rotasyon tipi sol
        const square = isFreeSquare(type, tcol, trow, rotType); // elde edilen rotasyondaki kare hamle yapılabilir bir kare mi kontrol et
        if (square) return square; // hamle yapılabilir bir kare bulunursa bu değeri yeni arrayin o elemanı için yeni değer olarak ata
      })
      .filter((item) => item); // hamle yapılabilen array listesi içerisinde boş değer varsa sil
  } else {
    // dama taşı ise gidebileceği rotasyonları x ve y ekseninde tek tek kontrol et , erişilebilir olanları arraye ekle
    for (let iCol = col + 1; iCol < 9; iCol++) {
      // bulunduğu satırda sağ tüm kareleri kontrol et
      const square = isFreeSquare(type, iCol, row, "right");
      if (!square) break;
      rotationArray.push(square);
    }
    for (let iCol = col - 1; iCol > 0; iCol--) {
      // bulunduğu satırda sol tüm kareleri kontrol et
      const square = isFreeSquare(type, iCol, row, "left");
      if (!square) break;
      rotationArray.push(square);
    }
    for (let iRow = row + 1; iRow < 9; iRow++) {
      // bulunduğu kolonda yukarı tüm kareleri kontrol et
      const square = isFreeSquare(type, col, iRow, "up");
      if (!square) break;
      rotationArray.push(square);
    }
    for (let iRow = row - 1; iRow > 0; iRow--) {
      // bulunduğu kolonda aşağı tüm kareleri  kontrol et
      const square = isFreeSquare(type, col, iRow, "down");
      if (!square) break;
      rotationArray.push(square);
    }
  }
  return rotationArray; // erişilebilir olan karelerin bir listesini dönder
};

// hamle için seçtiğim taşın hamle yapabileceği bir kare var mı , varsa o kareleri dönderir
export const pieceMoveSquares = (selectedPiece) => {
  const movedSquares = [];
  const captureSpacedSquares = [];
  const rotations = getAcceptRottaionArray(selectedPiece);

  let lastSpaced; // son üsten atlama hamlesi yapılan coord
  rotations.forEach(({ coord, capture }, index) => {
    capture
      ? (captureSpacedSquares.push(coord), (lastSpaced = coord))
      : movedSquares.push(coord);

    // eğer hamle yapan taş dama taşıysa
    if (selectedPiece.king) {
      // bir taşın üstünden atlanıldıysa
      if (lastSpaced) {
        // şuan kontrol edilen taş son üzerinden atlanan taş ile aynı satır yada kolonda yer alıyorsa
        const [pCol, pRow] = lastSpaced.split("/").map(Number); // önceki atlanan karenin kordinatları
        const [cCol, cRow] = coord.split("/").map(Number); // hedef karenin kordinatları
        // kareler aynı satır yada aynı kolon üzerinde yer alıyorsa
        if (pCol == cCol || pRow == cRow) {
          // iki kare arasındaki mesafe 1 birim ise
          if (Math.abs(pCol - cCol) == 1 || Math.abs(pRow - cRow) == 1) {
            // son atlanan kare artık bu kare
            lastSpaced = coord;
            // son atlanan kare indexi artık bu karenin indexi
            // atlanabilir kare listesine ekle
            captureSpacedSquares.push(coord);
          }
        }
      }
    }
  });
  const accesSquares =
    captureSpacedSquares.length > 0 ? captureSpacedSquares : movedSquares; // düşman taşını yiyebileceğin bir hamle varsa sadece o karelere hamle yapabilirsin taşı yemek zorundasın
  return accesSquares;
};

/// üzerinden atlanan rakip taşın tespiti
export const spacedSquares = (droppedPiece, squareCoord) => {
  const squares = Store.getState().checkers.entities;

  const [pCol, pRow] = droppedPiece.square.split("/").map(Number); // hamle yapılmadan önceki konum
  const [nCol, nRow] = squareCoord.split("/").map(Number); // hamlel yapıldıktan sonraki yeni kodum
  const spacedSquareCoord = [];

  const diffCol = pCol - nCol; // kolonlar farkı
  const diffRow = pRow - nRow; // satırlar farkı

  // aynı kolon üzerindelerse
  if (diffCol === 0) {
    const absDiffRow = Math.abs(diffRow); // satırların uzaklığı
    // satırların uzaklığı 1 den fazlaysa yenen bir taş var demektir
    if (absDiffRow > 1) {
      // hamle yapılan yöne göre arttırma yada eksiltme işlemini belirle
      const direction = diffRow > 0 ? -1 : 1;
      // iki kare arasındaki tüm kareleri atlanan karaler dizisine ekle
      for (let row = pRow + direction; row !== nRow; row += direction) {
        spacedSquareCoord.push(`${pCol}/${row}`);
      }
    }
  }
  // aynı satır üzerindelerse
  else {
    const absDiffCol = Math.abs(diffCol); // kolonların uzaklığı
    // satırların uzaklığı 1 den fazlaysa yenen bir taş var demektir
    if (absDiffCol > 1) {
      // hamle yapılan yöne göre arttırma yada eksiltme işlemini belirle
      const direction = diffCol > 0 ? -1 : 1;
      // iki kare arasındaki tüm kareleri atlanan karaler dizisine ekle
      for (let col = pCol + direction; col !== nCol; col += direction) {
        spacedSquareCoord.push(`${col}/${pRow}`);
      }
    }
  }

  //atlanan karelerin sadece içerisinde taş olanları seç
  const inPieceSquareCoords = spacedSquareCoord.filter(
    (coord) => squares[coord]?.piece
  );

  return inPieceSquareCoords;
};

// taş yeme zorunluluğunu kontrol eder , bu hamleye zorunlu bir taş varsa o taşın id sini içeren dizi dönderir
export const captureRequirementPiecesCheck = () => {
  const turnColor = Store.getState().checkers.turnColor;
  const capturePieces = [];
  const ownPieceSquares = getOwnPiecesSquareFromObjectArray(turnColor); // aynı tipte taşları içeren tüm kareleri alır
  ownPieceSquares.forEach(([, squareValue]) => {
    const forced = captureRequirementPieceCheck(squareValue.piece);
    forced && capturePieces.push(forced);
  });
  return capturePieces;
};

// tek bir taş için taş yeme zorunluluğunu kontrol eder , taşın hamle yapabileceği kordinatları alır ve bu kordinatlar içerisinde bir taş yiyebilen hamle varsa taşın kendi id sini yoksa null
export const captureRequirementPieceCheck = (piece) => {
  const rotations = getAcceptRottaionArray(piece); // karenin içerisindeki taşın gidebileceği kareleri al
  for (const { c, capture } of rotations) {
    if (capture) return piece.id;
  }
  return null;
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

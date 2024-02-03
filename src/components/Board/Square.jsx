import classNames from "classnames";
// component
import Piece from "../Piece";
// dnd
import { useDrop } from "react-dnd";
// redux
import { useDispatch, useSelector } from "react-redux";
import {
  checkerAdapterSelector,
  setForcedPiece,
  toggleTurnColor,
  updatePiece,
} from "../../redux/slices/checkersSlice";
// utilities
import {
  eatingRequirementPieceCheck,
  pieceMoveSquares,
  spacedSquares,
} from "../../utilities/utilitie";

const Square = ({ square: { id: squareCoord, piece } }) => {
  const dispatch = useDispatch();
  const squares = useSelector(checkerAdapterSelector.selectEntities);

  const [col, row] = squareCoord.split("/").map(Number); // bu karenin colon ve stün değeri
  const damaSquare = row === 8 || row === 1; // eğer bu kare 1. yada 8. satırda yer alıyorsa dama karesidir , bu karaye gelen taş dama taşı olur

  // seçilen taş bu kareye hamle yapabilir mi
  const canDropSquare = (selectedPiece) => {
    const pieceMovedSquares = pieceMoveSquares(selectedPiece); // taşın hamle yapabileceği kareler
    console.table(pieceMovedSquares)
    return pieceMovedSquares.includes(squareCoord); // şuanki kare o taşın hamle yapabileceği karelerin içerisinde mi yer alıyor
  };

  const dropSquare = (droppedPiece) => {
    const prevSquare = squares[droppedPiece.square]; // taşın hamle yapılmadan önceki bulunduğu kare
    const spaceSquares = spacedSquares(droppedPiece, squareCoord);

    dispatch(
      // önceki karede bulunan taş değerini sil
      updatePiece({
        id: prevSquare.id,
        changes: { piece: null },
      })
    );

    const setKing = !droppedPiece.king && damaSquare ? true : droppedPiece.king;
    dispatch(
      // taşın bırakıldığı yeni kareyi bırakılan taş ile güncelle
      updatePiece({
        id: squareCoord,
        changes: {
          piece: { ...droppedPiece, square: squareCoord, king: setKing },
        },
      })
    );

    spaceSquares.forEach((spacedSquare) => {
      dispatch(
        // karede bulunan taş değerini sil
        updatePiece({
          id: spacedSquare,
          changes: { piece: null },
        })
      );
    });

    // bu kareye gelinerek bir rakip taş yenildiyse , bu karaden devam hamlesi var mı onu kontrol et
    if (spaceSquares.length > 0) {
      // hamle sırası olan taşın devam hamlesi var mı kontrol et
      const eatingRequiredPiece = eatingRequirementPieceCheck({
        ...droppedPiece,
        square: squareCoord,
        king: setKing,
      });
      /**
       * son hamle yapan taraf için taş yiyebileceği bir devam hamlesi yoksa
       * veya bu hamleyi yapabilecek taş son hamle yapılan taş ile aynı değil ilse sıra rakibe geçer
       *  */
      if (eatingRequiredPiece == droppedPiece.id) {
        // oyuncu taraf için yeme hamlesi yapılabilir taş listesinde son hamle yapılan taş varsa devam et
        dispatch(setForcedPiece([droppedPiece.id]));
      } else {
        // oyuncu taraf için yeme hamlesi yapılabilir taş listesinde son hamle yapılan taş yoksa sıra rakiptes
        dispatch(setForcedPiece([]));
        dispatch(toggleTurnColor());
      }
    } else {
      dispatch(toggleTurnColor());
      dispatch(setForcedPiece([]));
    }
  };

  // Drag and drop event handlers
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "piece",
      canDrop: (piece) => canDropSquare(piece),
      drop: dropSquare,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [squares]
  );

  return (
    <div // square container
      ref={drop}
      className={classNames(
        "border h-20 w-20 flex justify-center items-center text-2xl font-bold text-slate-400/50 select-none relative",
        {
          "bg-slate-300": (col + row) % 2 === 0, // Light color if the sum of row and column numbers is even
          "bg-slate-500": (col + row) % 2 !== 0,
          "!bg-green-300": canDrop,
        } // Dark color if the sum of row and column numbers is odd
      )}
    >
      {piece ? <Piece piece={piece} /> : <span>{squareCoord}</span>}
      {/* Preview for drop area */}
      {isOver ? (
        <div
          className={classNames(
            "h-10 w-10  rounded-full absolute",
            {
              "bg-white": canDrop,
            },
            {
              "bg-red-300": !canDrop,
            }
          )}
        ></div>
      ) : (
        canDrop && (
          <div className="h-10 w-10  rounded-full absolute bg-gray-600"></div>
        )
      )}
      {/* End preview */}
    </div>
  );
};

export default Square;

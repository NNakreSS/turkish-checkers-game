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
  capturePiece,
} from "../../redux/slices/checkersSlice";
// utilities
import {
  captureRequirementPieceCheck,
  captureRequirementPiecesCheck,
  pieceMoveSquares,
  spacedSquares,
} from "../../utilities/utilitie";
import { memo } from "react";

const Square = ({ square: { id: squareCoord, piece } }) => {
  const dispatch = useDispatch();
  const squares = useSelector(checkerAdapterSelector.selectEntities);

  const [col, row] = squareCoord.split("/").map(Number); // bu karenin colon ve stün değeri
  const damaSquare = row === 8 || row === 1; // eğer bu kare 1. yada 8. satırda yer alıyorsa dama karesidir , bu karaye gelen taş dama taşı olur

  // seçilen taş bu kareye hamle yapabilir mi
  const canDropHandle = (pieceMovedSquares) =>
    pieceMovedSquares.includes(squareCoord); // şuanki kare o taşın hamle yapabileceği karelerin içerisinde mi yer alıyor

  const dropHandle = (droppedPiece) => {
    const prevSquare = squares[droppedPiece.square]; // taşın hamle yapılmadan önceki bulunduğu kare
    const spaceSquares = spacedSquares(droppedPiece, squareCoord);

    // önceki karede bulunan taş değerini sil
    dispatch(
      updatePiece({
        id: prevSquare.id,
        changes: { piece: null },
      })
    );

    const setKing = !droppedPiece.king && damaSquare ? true : droppedPiece.king;
    // taşın bırakıldığı yeni kareyi bırakılan taş ile güncelle
    dispatch(
      updatePiece({
        id: squareCoord,
        changes: {
          piece: { ...droppedPiece, square: squareCoord, king: setKing },
        },
      })
    );

    spaceSquares.forEach((spacedSquare) => {
      // karede bulunan taş değerini sil
      dispatch(
        updatePiece({
          id: spacedSquare,
          changes: { piece: null },
        })
      );
      // rakibe puan ekle
      dispatch(capturePiece(droppedPiece.type));
    });

    // bu kareye gelinerek bir rakip taş yenildiyse , bu karaden devam hamlesi var mı onu kontrol et
    if (spaceSquares.length > 0) {
      // hamle sırası olan taşın devam hamlesi var mı kontrol et
      const captureRequiredPiece = captureRequirementPieceCheck({
        ...droppedPiece,
        square: squareCoord,
        king: setKing,
      });
      /**
       * son hamle yapan taraf için taş yiyebileceği bir devam hamlesi yoksa
       * veya bu hamleyi yapabilecek taş son hamle yapılan taş ile aynı değil ilse sıra rakibe geçer
       *  */
      if (captureRequiredPiece == droppedPiece.id) {
        // oyuncu taraf için yeme hamlesi yapılabilir taş listesinde son hamle yapılan taş varsa devam et
        dispatch(setForcedPiece([droppedPiece.id]));
      } else {
        // oyuncu taraf için yeme hamlesi yapılabilir taş listesinde son hamle yapılan taş yoksa sıra rakiptes
        switchTurnColor();
      }
    } else {
      switchTurnColor();
    }
  };

  const switchTurnColor = () => {
    dispatch(toggleTurnColor());
    const captureRequiredPieces = captureRequirementPiecesCheck();
    dispatch(setForcedPiece([...captureRequiredPieces]));
  };

  // Drag and drop event handlers
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "piece",
      canDrop: (item) => canDropHandle(item.pieceMovedSquares),
      drop: (item) => dropHandle(item.piece),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    []
  );

  return (
    <div // square container
      ref={drop}
      className={classNames(
        "flex justify-center items-center select-none relative",
        {
          "bg-stone-300": (col + row) % 2 === 0, // Light color if the sum of row and column numbers is even
          "bg-amber-950": (col + row) % 2 !== 0,
        } // Dark color if the sum of row and column numbers is odd
      )}
    >
      {piece ? (
        <Piece piece={piece} />
      ) : isOver ? (
        <div
          className={classNames(
            "w-1/2 h-1/2 rounded-full",
            {
              "bg-green-300": canDrop,
            },
            {
              "bg-red-300": !canDrop,
            }
          )}
        ></div>
      ) : (
        canDrop && <div className="w-1/2 h-1/2 rounded-full bg-gray-400"></div>
      )}
    </div>
  );
};

export default memo(Square);

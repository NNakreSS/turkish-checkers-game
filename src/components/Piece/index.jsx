import { DragPreviewImage, useDrag } from "react-dnd";
// images
import dama_white from "../../assets/dama_white.png";
import dama_black from "../../assets/dama_black.png";
// utilites
import {
  checkForcePiece,
  isPieceCanMove,
  isPlacePieceOnCoord,
} from "../../utilities/utilitie";
// redux
import { useDispatch, useSelector } from "react-redux";
import {
  checkerAdapterSelector,
  checkersSelector,
  setForcedPiece,
} from "../../redux/slices/checkersSlice";

const Piece = ({ boardCoord }) => {
  const dispatch = useDispatch();
  const pieces = useSelector(checkerAdapterSelector.selectAll);
  const piece = isPlacePieceOnCoord(boardCoord, pieces);
  const { forcedPieces, turnColor } = useSelector(checkersSelector);

  const isCanDrag = (selectedPiece) => {
    if (turnColor == selectedPiece.type) {
      const forcedPieces = checkForcePiece(selectedPiece.type, pieces);
      console.log(forcedPieces);
      if (forcedPieces.length > 0) {
        dispatch(setForcedPiece(forcedPieces));
        if (!forcedPieces.includes(selectedPiece.id)) {
          console.info("Bir taşı yemek zorundasın");
          return false;
        } else return true;
      } else return isPieceCanMove(pieces, selectedPiece);
    } else {
      alert("rakibin sırası");
    }
  };

  const [{ opacity }, dragRef, dragPreview] = useDrag(
    () => ({
      type: "piece",
      item: piece,
      canDrag: () => isCanDrag(piece),
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.3 : 1,
      }),
    }),
    [piece, isCanDrag]
  );

  if (piece) {
    const piese_img = piece.type == "white" ? dama_white : dama_black;
    return (
      <>
        <DragPreviewImage connect={dragPreview} src={piese_img} />
        <img
          ref={dragRef}
          style={{ opacity }}
          data-piece={JSON.stringify(piece)}
          src={piese_img}
          className="w-16 h-16 piece z-10"
        />
        {forcedPieces.includes(piece.id) ? (
          <div className="absolute h-[70px] w-[70px] bg-lime-400  select-none rounded-full"></div>
        ) : (
          piece.king && (
            <div className="absolute h-[75px] w-[75px] bg-yellow-500  select-none rounded-full"></div>
          )
        )}
      </>
    );
  } else {
    // return <span>{boardCoord}</span>;
  }
};
export default Piece;

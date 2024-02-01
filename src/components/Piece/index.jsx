import classNames from "classnames";
import { DragPreviewImage, useDrag } from "react-dnd";
// images
import dama_white from "../../assets/dama_white.png";
import dama_black from "../../assets/dama_black.png";

const isPlacePieceOnCoord = (coord, pieces) => {
  const piecesArray = [...pieces.black, ...pieces.white];
  const onBoardPieces = piecesArray.filter((piece) => piece.coord === coord)[0];
  return onBoardPieces;
};

const Piece = ({ boardCoord, pieces }) => {
  const piece = isPlacePieceOnCoord(boardCoord, pieces);

  if (piece) {
    const [{ opacity }, dragRef, dragPreview] = useDrag(
      () => ({
        type: "piece",
        item: { id: piece.id },
        collect: (monitor) => ({
          opacity: monitor.isDragging() ? 0.5 : 1,
        }),
      }),
      []
    );

    return (
      <>
        <DragPreviewImage
          connect={dragPreview}
          src={piece.type == "white" ? dama_white : dama_black}
        />
        <img
          draggable
          ref={dragRef}
          style={{ opacity }}
          data-piece={JSON.stringify(piece)}
          src={piece.type == "white" ? dama_white : dama_black}
          className={classNames("w-16 h-16 piece cursor-pointer", {
            "border-white dama_black": piece.type == "black",
            "border-black dama_white": piece.type == "white",
          })}
        />
      </>
    );
  } else {
    return <span>{boardCoord}</span>;
  }
};
export default Piece;

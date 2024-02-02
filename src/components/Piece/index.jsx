import classNames from "classnames";
import { DragPreviewImage, useDrag } from "react-dnd";
// images
import dama_white from "../../assets/dama_white.png";
import dama_black from "../../assets/dama_black.png";
// utilites
import { isPlacePieceOnCoord } from "../../utilities/utilitie";
// redux
import { useSelector } from "react-redux";
import { checkerAdepterSelector } from "../../redux/slices/checkersSlice";

const Piece = ({ boardCoord }) => {
  const pieces = useSelector(checkerAdepterSelector.selectAll);

  const piece = isPlacePieceOnCoord(boardCoord, pieces);

  const [{ opacity, isDragging }, dragRef, dragPreview] = useDrag(
    () => ({
      type: "piece",
      item: piece,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.3 : 1,
        isDragging: !!monitor.isDragging,
      }),
    }),
    [piece]
  );

  if (piece) {
    const piese_img = piece.type == "white" ? dama_white : dama_black;
    return (
      <>
        {/* <DragPreviewImage connect={dragPreview} src={piese_img} /> */}
        <img
          ref={dragRef}
          style={{ opacity }}
          data-piece={JSON.stringify(piece)}
          src={piese_img}
          className={classNames("w-16 h-16 piece z-10", {
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

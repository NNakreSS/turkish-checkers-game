import { DragPreviewImage, useDrag } from "react-dnd";
// images
import dama_white from "../../assets/dama_white.png";
import dama_black from "../../assets/dama_black.png";
// utilites
import { pieceMoveSquares } from "../../utilities/utilitie";
// redux
import { useSelector } from "react-redux";
import {
  checkersSelector,
} from "../../redux/slices/checkersSlice";

const Piece = ({ piece }) => {
  const { forcedPieces, turnColor } = useSelector(checkersSelector);

  const isCanDrag = (selectedPiece) => {
    // oynama sırası oynatılmaya çalışılan taşta mı diye kontrol et
    if (turnColor == selectedPiece.type) {
      // oynanması zorunlu olan bir taş var mı
      if (forcedPieces.length > 0) {
        // oynanması zorunlu olan taş varsa , oynatılmaya çalışılan taş onlardan biri mi
        if (forcedPieces.includes(selectedPiece.id)) {
          return true;
        } else {
          console.info("Bir taşı yemek zorundasın");
          return false; // oyması zorunlu bir taş var ve seçilen bu taş değilse izin verme
        }
      } else true; // oyması zorunlu bir taş yoksa sürüklenebilir
      // sıra oynatılmaya çalışılan taşta değilse uyarı ver
    } else {
      console.warn("sıra rakipte");
      return false; // sırası gelmeyen biri hamle yapmaya çalışırsa izin verme
    }

    const moveSquares = pieceMoveSquares(selectedPiece);
    return moveSquares.length > 0;
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
    [piece,forcedPieces , isCanDrag]
  );

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
};
export default Piece;

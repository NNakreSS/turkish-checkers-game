import { DragPreviewImage, useDrag } from "react-dnd";
// images
import dama_white from "../../assets/dama_white.png";
import dama_black from "../../assets/dama_black.png";
import dama_white_king from "../../assets/dama_white_king.png";
import dama_black_king from "../../assets/dama_black_king.png";
// redux
import { useSelector } from "react-redux";
import { checkersSelector } from "../../redux/slices/checkersSlice";
import { toast } from "react-toastify";

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
          toast.warn("Bir taşı yemek zorundasın !", {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            theme: "light",
          });
          return false; // oyması zorunlu bir taş var ve seçilen bu taş değilse izin verme
        }
      } else {
        // oyması zorunlu bir taş yoksa sürüklenebilir
        return true;
      }
      // sıra oynatılmaya çalışılan taşta değilse uyarı ver
    } else {
      toast.error("Sıra rakipte !", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "light",
      });
      return false; // sırası gelmeyen biri hamle yapmaya çalışırsa izin verme
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
    [piece, forcedPieces, isCanDrag]
  );

  const piese_img =
    piece.type == "white"
      ? piece.king
        ? dama_white_king
        : dama_white
      : piece.king
      ? dama_black_king
      : dama_black;

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
      {forcedPieces.includes(piece.id) && (
        <div className="absolute h-full w-full bg-sky-200 select-none "></div>
      )}
    </>
  );
};
export default Piece;

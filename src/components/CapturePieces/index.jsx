import { useSelector } from "react-redux";
import { checkersSelector } from "../../redux/slices/checkersSlice";
// imgs
import piece_white from "../../assets/piece_white.png";
import piece_black from "../../assets/piece_black.png";

const Piece = ({ src, ...props }) => {
  return <img src={src} {...props} className="absolute" />;
};

const CapturePieces = () => {
  const { black, white } = useSelector(checkersSelector).capturePieces;
  const blackPieces = new Array(black).fill();
  const whitePieces = new Array(white).fill();

  return (
    <div className="bg-orange-900 w-full p-1 rounded-lg shadow-[inset_0_0_30px_rgba(0,0,0)] border-2 border-black select-none">
      <div id="blackPieces" className="relative h-[50%]">
        {blackPieces.map((x, i) => (
          <Piece key={i} style={{ top: i * 5 + "%" }} i={i} src={piece_white} />
        ))}
      </div>
      <div id="whitePieces" className="relative h-[50%]">
        {whitePieces.map((x, i) => (
          <Piece
            key={i}
            i={i}
            style={{ bottom: i * 6 + "%" }}
            src={piece_black}
          />
        ))}
      </div>
    </div>
  );
};

export default CapturePieces;

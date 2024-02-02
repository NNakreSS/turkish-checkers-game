import classNames from "classnames";
// component
import Piece from "../Piece";
// dnd
import { useDrop } from "react-dnd";
// redux
import { useDispatch, useSelector } from "react-redux";
import {
  checkerAdepterSelector,
  updatePiece,
} from "../../redux/slices/checkersSlice";

const Square = ({ col, row, col_index, row_index }) => {
  const dispatch = useDispatch();
  const SquareCoord = `${col}/${row}`;

  const ConDropPieceSquare = ({ id, coord, type, king }) => {
    const [col, row] = coord.split("/").map((item) => Number(item));
    const accesSquareForPiece = [];
    console.log(col, row);
    if (type == "white") {
      accesSquareForPiece.push(`${col}/${row + 1}`);
      accesSquareForPiece.push(`${col + 1}/${row}`);
      accesSquareForPiece.push(`${col - 1}/${row}`);
    }
    return accesSquareForPiece.find((item) => item == SquareCoord);
  };

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "piece",
      canDrop: (piece) => ConDropPieceSquare(piece),
      drop: ({ id }) =>
        dispatch(updatePiece({ id, changes: { coord: SquareCoord } })),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    []
  );

  return (
    <div // rows and cols boxs
      ref={drop}
      // data-coord={SquareCoord}
      className={classNames(
        "border h-20 w-20 flex justify-center items-center text-2xl font-bold text-slate-400/50 select-none relative",
        { "bg-slate-300": (col_index + row_index) % 2 == 0 }, // satır ve stün numaralarının toplamı çift sayı ise açık renk
        { "bg-slate-500": (col_index + row_index) % 2 != 0 } // satır ve stün numaralarının toplamı tej sayı ise koyu renk
        // { "bg-green-600": canDrop } // satır ve stün numaralarının toplamı tej sayı ise koyu renk
      )}
    >
      <Piece boardCoord={SquareCoord} />
      {/* preview for drag box area */}
      {isOver ? (
        <div
          className={classNames(
            "h-10 w-10  rounded-full absolute",
            {
              "bg-green-300": canDrop,
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
      {/* end preview */}
    </div>
  );
};

export default Square;

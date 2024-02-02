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
  updatePiece,
} from "../../redux/slices/checkersSlice";
// utilities
import { checkCanDrop, checkForcePiece } from "../../utilities/utilitie";

const Square = ({ col: sCol, row: sRow, col_index, row_index }) => {
  const dispatch = useDispatch();
  const pieces = useSelector(checkerAdapterSelector.selectAll);
  const squareCoord = `${sCol}/${sRow}`;

  // Check if the square is suitable for the piece
  const canDropSquare = ({ coord, type, king }) => {
    if (!king) {
      return checkCanDrop({
        coord,
        squareCoord,
        type,
        pieces,
      });
    } else {
      // TODO: Implement possible moves for king piece
      return false;
    }
  };

  // Drag and drop event handlers
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "piece",
      canDrop: (piece) => canDropSquare(piece),
      drop: ({ id, type }) => {
        dispatch(updatePiece({ id, changes: { coord: squareCoord } }));
        dispatch(setForcedPiece([]));
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [pieces]
  );

  return (
    <div // square container
      ref={drop}
      className={classNames(
        "border h-20 w-20 flex justify-center items-center text-2xl font-bold text-slate-400/50 select-none relative",
        {
          "bg-slate-300": (col_index + row_index) % 2 === 0, // Light color if the sum of row and column numbers is even
          "bg-slate-500": (col_index + row_index) % 2 !== 0,
          "!bg-green-300": canDrop,
        } // Dark color if the sum of row and column numbers is odd
      )}
    >
      <Piece boardCoord={squareCoord} />
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

import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import classNames from "classnames";
// utilites
import { createGameBoard } from "../../utilities/utilitie";
// components
// components
import Rows from "./bits/Rows";
import Cols from "./bits/Cols";
import BoardMain from "./BoardMain";
// redux
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addPieces, checkersSelector } from "../../redux/slices/checkersSlice";
import CapturePieces from "../CapturePieces";

const Board = () => {
  const dispatch = useDispatch();
  const turnColor = useSelector(checkersSelector).turnColor;

  useEffect(() => {
    const gameSquares = createGameBoard();
    dispatch(addPieces(gameSquares));
  }, [dispatch]);

  return (
    <div className="relative">
      <div
        id="board"
        className="m-auto h-screen grid grid-cols-[calc(.6*5rem)_calc(8*5rem)_5rem] place-content-center box-border justify-items-center gap-1 shadow-[inset_0_0_30px_rgba(0,0,0)]"
      >
        <Rows />
        {/* Board Main start */}
        <DndProvider backend={HTML5Backend}>
          <BoardMain />
        </DndProvider>
        <CapturePieces />
        <div
          className={classNames("w-full h-11 rounded-bl-lg transition-all delay-150", {
            "bg-black": turnColor == "black",
            "bg-white": turnColor == "white",
          })}
        ></div>
        {/* Board Main end */}
        <Cols />
      </div>
    </div>
  );
};

export default Board;

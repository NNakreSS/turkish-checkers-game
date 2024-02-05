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
        className={classNames(
          "m-auto p-5 box-border grid gap-[2px] place-content-center",
          "grid-cols-[calc(0.6*2rem)_calc(8*2.3rem)_2rem] grid-rows-[calc(8*2.3rem)_calc(0.6*2rem)]",
          "sm:grid-cols-[calc(0.6*3rem)_calc(8*4rem)_3rem] sm:grid-rows-[calc(8*4rem)_calc(0.6*3rem)]",
          "md:grid-cols-[calc(0.6*4rem)_calc(8*4.5rem)_4rem] md:grid-rows-[calc(8*4.5rem)_calc(0.6*4rem)]"
        )}
      >
        <Rows />
        <BoardMain />
        <CapturePieces />
        <div
          className={classNames(
            "w-full h-full rounded-bl-lg transition-all delay-150",
            {
              "bg-black": turnColor == "black",
              "bg-white": turnColor == "white",
            }
          )}
        ></div>
        <Cols />
      </div>
    </div>
  );
};

export default Board;

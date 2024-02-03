import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
// utilites
import { createGameBoard } from "../../utilities/utilitie";
// components
// components
import Rows from "./bits/Rows";
import Cols from "./bits/Cols";
import BoardMain from "./BoardMain";
// redux
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addPieces } from "../../redux/slices/checkersSlice";

const Board = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const gameSquares = createGameBoard();
    dispatch(addPieces(gameSquares));
  }, [dispatch]);

  return (
    <div
      id="board"
      className="m-auto mt-10 grid grid-cols-[calc(.6*5rem)_calc(8*5rem)] place-content-center"
    >
      <Rows />
      {/* Board Main start */}
      <DndProvider backend={HTML5Backend}>
        <BoardMain />
      </DndProvider>
      {/* Board Main end */}
      <Cols />
    </div>
  );
};

export default Board;

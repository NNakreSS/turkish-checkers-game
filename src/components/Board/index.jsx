import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
// utilites
import { createGameBoard, createPieces } from "../../utilities/utilitie";
// components
// components
import Rows from "./bits/Rows";
import Cols from "./bits/Cols";
import BoardMain from "./BoardMain";
// redux
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addPieces, checkersSelector } from "../../redux/slices/checkersSlice";

const Board = () => {
  const {
    Squares: { cols, rows },
  } = useSelector(checkersSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    const pieces = createPieces();
    dispatch(addPieces(pieces));
  }, []);

  return (
    <div
      id="board"
      className="m-auto mt-10 grid grid-cols-[calc(.6*5rem)_calc(8*5rem)] place-content-center"
    >
      <Rows array={rows} /** rows bits  */ />
      {/* Board Main start */}
      <DndProvider backend={HTML5Backend}>
        <BoardMain cols={cols} rows={rows} />
      </DndProvider>
      {/* Board Main end */}
      <Cols array={cols} /** cols bits  */ />
    </div>
  );
};

export default Board;

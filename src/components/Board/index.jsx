import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
// utilites
import { createGameBoard, createPieces } from "../../utilities/utilitie";
// components
import Rows from "./bits/Rows";
import Cols from "./bits/Cols";
import BoardMain from "./BoardMain";

const { cols, rows } = createGameBoard();
const Pieces = createPieces();

const Board = () => {
  return (
    <div
      id="board"
      className="m-auto mt-10 grid grid-cols-[calc(.6*5rem)_calc(8*5rem)] place-content-center"
    >
      <Rows array={rows} /** rows bits  */ />
      {/* Board Main start */}
      <DndProvider backend={HTML5Backend}>
        <BoardMain pieces={Pieces} cols={cols} rows={rows} />
      </DndProvider>
      {/* Board Main end */}
      <Cols array={cols} /** cols bits  */ />
    </div>
  );
};

export default Board;

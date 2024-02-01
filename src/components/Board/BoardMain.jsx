import classNames from "classnames";
import Piece from "../Piece";
import { useDrop } from "react-dnd";

const BoardMain = ({ rows, cols, pieces }) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "piece",
      canDrop: () => console.log("can drop"),
      drop: () => console.log("drop"),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    []
  );

  return (
    <div className="m-auto bg-sky-300 grid grid-cols-8 grid-rows-8 w-[calc(8*5rem)]">
      {rows.map((row, j) =>
        cols.map((col, i) => (
          <div // rows and cols boxs
            ref={drop}
            key={col + "-" + row}
            data-coord={col + "/" + row}
            className={classNames(
              "border h-20 w-20 flex justify-center items-center text-2xl font-bold text-slate-400/50 select-none",
              { "bg-slate-300": (i + j) % 2 == 0 },
              { "bg-slate-500": (i + j) % 2 != 0 }
            )}
          >
            {/* {col + "/" + row} */}
            <Piece boardCoord={col + "/" + row} pieces={pieces} />
          </div>
        ))
      )}
    </div>
  );
};

export default BoardMain;

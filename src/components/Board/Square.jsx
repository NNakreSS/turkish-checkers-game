import classNames from "classnames";
import Piece from "../Piece";
// dnd
import { useDrop } from "react-dnd";

const Square = ({ col, row, col_index, row_index, pieces }) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "piece",
      drop: (item) => console.log(item, col + "/" + row),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  return (
    <div // rows and cols boxs
      ref={drop}
      data-coord={col + "/" + row}
      className={classNames(
        "border h-20 w-20 flex justify-center items-center text-2xl font-bold text-slate-400/50 select-none",
        { "bg-slate-300": (col_index + row_index) % 2 == 0 }, // satır ve stün numaralarının toplamı çift sayı ise açık renk
        { "bg-green-300": isOver }, // hover
        { "bg-slate-500": (col_index + row_index) % 2 != 0 } // satır ve stün numaralarının toplamı tej sayı ise koyu renk
      )}
    >
      {/* {col + "/" + row} */}
      <Piece boardCoord={col + "/" + row} pieces={pieces} />
    </div>
  );
};

export default Square;

import Square from "./Square";


const BoardMain = ({ rows, cols }) => {
  return (
    <div className="m-auto bg-sky-300 grid grid-cols-8 grid-rows-8 w-[calc(8*5rem)]">
      {rows.map((row, j) =>
        cols.map((col, i) => (
          <Square
            key={col + "-" + row}
            row={row}
            col={col}
            col_index={i}
            row_index={j}
          />
        ))
      )}
    </div>
  );
};

export default BoardMain;

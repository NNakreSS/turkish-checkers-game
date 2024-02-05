import { useSelector } from "react-redux";
import { checkerAdapterSelector } from "../../redux/slices/checkersSlice";
// component
import Square from "./Square";
// dnd
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
const BoardMain = () => {
  const squares = useSelector(checkerAdapterSelector.selectAll);
  return (
    <DndProvider
      backend={TouchBackend}
      options={{
        enableMouseEvents: true,
      }}
    >
      <div className="m-auto grid grid-cols-8 grid-rows-8 w-full h-full border-4 border-black box-border">
        {squares.map((item, index) => (
          <Square key={index} square={item} />
        ))}
      </div>
    </DndProvider>
  );
};

export default BoardMain;

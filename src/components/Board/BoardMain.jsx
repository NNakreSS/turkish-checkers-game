import { useSelector } from "react-redux";
import Square from "./Square";
import { checkerAdapterSelector } from "../../redux/slices/checkersSlice";
const BoardMain = () => {
  const squares = useSelector(checkerAdapterSelector.selectAll);
  return (
    <div className="m-auto grid grid-cols-8 grid-rows-8 w-[calc(8*5rem)] border-8 border-amber-950 box-border">
      {squares.map((item, index) => (
        <Square key={index} square={item} />
      ))}
    </div>
  );
};

export default BoardMain;

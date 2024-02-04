import { useSelector } from "react-redux";
import Square from "./Square";
import { checkerAdapterSelector } from "../../redux/slices/checkersSlice";
const BoardMain = () => {
  const squares = useSelector(checkerAdapterSelector.selectAll);
  return (
    <div className="m-auto bg-sky-300 grid grid-cols-8 grid-rows-8 w-[calc(8*5rem)]">
      {squares.map((item, index) => (
        <Square key={index} square={item} />
      ))}
    </div>
  );
};

export default BoardMain;

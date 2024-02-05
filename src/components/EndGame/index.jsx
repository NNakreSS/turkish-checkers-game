import { useDispatch, useSelector } from "react-redux";
import {
  addPieces,
  checkersSelector,
  resetGameSates,
} from "../../redux/slices/checkersSlice";
import classNames from "classnames";
import { createGameBoard } from "../../utilities/utilitie";

const EndGame = () => {
  const dispatch = useDispatch();
  const winner = useSelector(checkersSelector).winner;

  const resetClickHandle = () => {
    dispatch(resetGameSates());
    const gameSquares = createGameBoard();
    dispatch(addPieces(gameSquares));
  };

  return (
    <div className="absolute w-[100%] h-[100%] bg-black/60 z-50 top-0 left-0 flex justify-center items-center">
      <div className="bg-white rounded-md p-5 min-w-96 flex flex-wrap flex-col items-center relative shadow-lg shadow-white/50">
        <span className="text-5xl text-green-500 font-bold">Kazanan</span>
        <span
          className={classNames(
            "text-3xl font-medium mt-10 bg-green-500 p-2 rounded-lg w-full flex justify-center items-center min-h-16",
            {
              "text-white": winner == "white",
              "text-black": winner == "black",
            }
          )}
        >
          {winner}
        </span>
        <button
          onClick={resetClickHandle}
          className="my-5 p-2 rounded-md  font-medium hover:bg-green-300 border-2 border-green-300 text-green-500 hover:text-white transition-all delay-100 shadow-lg shadow-black/30"
        >
          Yeniden Başla
        </button>
      </div>
    </div>
  );
};

export default EndGame;

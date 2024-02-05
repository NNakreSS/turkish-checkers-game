import { useSelector } from "react-redux";
// toastify
import "react-toastify/dist/ReactToastify.css";
import { checkersSelector } from "./redux/slices/checkersSlice";
import { ToastContainer } from "react-toastify";
// components
import Board from "./components/Board";
import EndGame from "./components/EndGame";

function App() {
  const winner = useSelector(checkersSelector).winner;
  return (
    <>
      {winner && <EndGame />}
      <ToastContainer />
      <Board />
      <footer className="p-3 flex justify-center items-center text-2xl font-bold text-slate-500">
        <a href="https://github.com/NNakreSS/turkish-checkers-game">
          NakreS Develeopment - Github
        </a>
      </footer>
    </>
  );
}

export default App;

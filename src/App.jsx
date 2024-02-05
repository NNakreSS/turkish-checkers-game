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
      <ToastContainer />
      {winner && <EndGame />}
      <Board />
    </>
  );
}

export default App;

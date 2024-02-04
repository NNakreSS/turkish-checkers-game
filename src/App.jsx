import { useSelector } from "react-redux";
import Board from "./components/Board";
// toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkersSelector } from "./redux/slices/checkersSlice";

function App() {
  const winner = useSelector(checkersSelector).winner;
  return (
    <>
      <ToastContainer />
      {winner && <h1>Kaznan {winner}</h1>}
      <Board />
    </>
  );
}

export default App;

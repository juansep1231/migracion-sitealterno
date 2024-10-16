import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { MainRouter } from "./routes/MainRouter";

function App() {
  return (
    <>
      <ToastContainer autoClose={2000} />
      <MainRouter />
    </>
  );
}

export default App;

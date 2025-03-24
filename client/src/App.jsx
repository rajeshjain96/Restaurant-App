import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./components/Home";
import ShowModal from "./components/ShowModal";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Home /> {/* <ShowModal></ShowModal> */}
    </>
  );
}

export default App;

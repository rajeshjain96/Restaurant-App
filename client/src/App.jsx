import { useState } from "react";

import "./App.css";
import Home from "./components/Home";
import RestaurantHomePage from "./components_r/RestaurantHomePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* This Home Component was developed for Nimbalkar's sw.
    commented on date: 05.04.2025*/}
      {/* <Home /> */}
      <RestaurantHomePage />
    </>
  );
}

export default App;

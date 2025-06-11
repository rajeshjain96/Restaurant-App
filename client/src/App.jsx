import { useState } from "react";
import "./App.css";
import RestaurantHomePage from "./components_r/RestaurantHomePage";
import axios from "axios";
import Home from "./components/Home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import EnquiryRemarks from "./components_r/enquiryRemarks";
function App() {
  axios.defaults.withCredentials = true; // ⬅️ Important!

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RestaurantHomePage />} />
          <Route path="/enquiryRemarks" element={<EnquiryRemarks />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </Router>
      {/* This Home Component was developed for Nimbalkar's sw.
    commented on date: 05.04.2025*/}
      {/* <Home /> */}
    </>
  );
}

export default App;

import { useState } from "react";
import "./App.css";
import RestaurantHomePage from "./components_r/RestaurantHomePage";
import axios from "axios";
import Home from "./components/Home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import EnquiryRemarks from "./components_r/enquiryRemarks";
import SampleForm from "./components_r/sampleForm";
import Resources from "./components_r/Resources";
import AdminEnquiryFiles from "./components_r/AdminEnquiryFiles";
import AdminEnquiryRemarks from "./components_r/AdminEnquiryRemarks";
import ClientResources from "./components_r/ClientResources";
function App() {
  axios.defaults.withCredentials = true; // ⬅️ Important!

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RestaurantHomePage />} />
          <Route path="/sampleForm" element={<SampleForm />} />
          <Route path="/ClientResources" element={<ClientResources />} />
          <Route
            path="/AdminEnquiryRemarks"
            element={<AdminEnquiryRemarks />}
          />
          <Route path="/AdminEnquiryFiles" element={<AdminEnquiryFiles />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </Router>
      {/* This Home Component was developed for Nimbalkar's sw.
    commented on date: 05.04.2025*/}
      {/* <Home /> */}
    </>
  );
}

export default App;

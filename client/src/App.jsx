import "./App.css";
import MainPage from "./components/MainPage";
import axios from "axios";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import EnquiryRemarks from "./components_r/enquiryRemarks";
import SampleForm from "./components/sampleForm";
import Resources from "./components/Resources";
import AdminEnquiryFiles from "./components/AdminEnquiryFiles";
import AdminEnquiryRemarks from "./components/AdminEnquiryRemarks";
import ClientResources from "./components/ClientResources";
function App() {
  axios.defaults.withCredentials = true; // ⬅️ Important!

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
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

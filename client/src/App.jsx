import { useState } from "react";

import "./App.css";
import Home from "./components/Home";
import RestaurantHomePage from "./components_r/RestaurantHomePage";
import EComm from "./components_Ecomm/EComm";
import SamplePdfGenerator from "./components_r/SamplePdfGenerator";
import TableExportOnly from "./components_r/TableExportOnly";
import axios from "axios";
import UploadForm from "./components_r/UploadForm";
import FileUpload from "./components_r/FileUpload";
import EditStudentImages from "./EditStudentImages";
import StudentList from "./components_r/StudentList";
import PdfViewer from "./components_r/PdfViewer";

function App() {
  const [count, setCount] = useState(0);
  axios.defaults.withCredentials = true; // ⬅️ Important!

  return (
    <>
      {/* This Home Component was developed for Nimbalkar's sw.
    commented on date: 05.04.2025*/}
      {/* <Home /> */}
      {/* Restaurant App */}
      {/* <FileUpload /> */}
      <RestaurantHomePage />
      {/* <PdfViewer /> */}
      {/* <div className="App">
        <PdfViewer />
      </div>
      <EditStudentImages />
      <StudentList /> */}
      {/* <UploadForm /> */}
      {/* The following component tried on 14.05 for pdf file creation */}
      {/* <SamplePdfGenerator /> */}
      {/* <TableExportOnly /> */}
      {/* <EComm/> */}
    </>
  );
}

export default App;

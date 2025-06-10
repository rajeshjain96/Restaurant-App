import { useState } from "react";
import "./App.css";
import RestaurantHomePage from "./components_r/RestaurantHomePage";
import axios from "axios";
import Home from "./components/Home";
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

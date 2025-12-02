import "./App.css";
import { BarcodeHtml5Reader } from "./HtmlQrCode";

function App() {

  return (
    <div>
      <h1>React Barcode Scanner</h1>
        <BarcodeHtml5Reader  />
    </div>
  );
}

export default App;

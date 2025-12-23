import "./App.css";
import { QrCodeHtml5Reader } from "./QrCode";

function App() {
  return (
    <div>
      <h1>React Barcode Scanner</h1>
      {/* <BarcodeHtml5Reader  /> */}
      <QrCodeHtml5Reader />
    </div>
  );
}

export default App;

// import { useState } from "react";
import "./App.css";
import { BarcodeHtml5Reader } from "./HtmlQrCode";
// import { DeviceSelectionExample } from "./ScanBarCode";
// import { BarcodeScanner } from "./QuaggaBarReader";
// import { DeviceSelectionExample } from "./ScanBarCode";
// import { Barcode128Reader } from "./YudielScanner";

function App() {
  // const [scannedCode, setScannedCode] = useState(null);

  // const handleBarcodeDetected = (result: any) => {
  //   if (result && result.codeResult) {
  //     setScannedCode(result.codeResult.code);
  //     // Optionally, stop scanning after a successful scan
  //     // Quagga.stop();
  //   }
  // };

  return (
    <div>
      <h1>React Barcode Scanner</h1>
      {/* {scannedCode ? (
        <p>Scanned Code: {scannedCode}</p>
      ) : ( */}
        <BarcodeHtml5Reader  />
      {/* // )} */}
    </div>
  );
}

export default App;

import { useState } from "react";
import "./App.css";
import { BarcodeScanner } from "./reader";

function App() {
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const handleBarcodeDetected = (code: string) => {
    console.log("📦 Código detectado:", code);
    setScannedCode(code);
  };

  return (
    <div>
      <h1>React Barcode Scanner</h1>

      {scannedCode ? (
        <p>Scanned Code: {scannedCode}</p>
      ) : (
        <BarcodeScanner onDetected={handleBarcodeDetected} />
      )}
    </div>
  );
}

export default App;

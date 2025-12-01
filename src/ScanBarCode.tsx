import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export const DeviceSelectionExample = () => {
  const [data, setData] = useState("");

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Leitor de Código de Barras (EAN-13)</h2>

      <div
        style={{
          width: "100%",
          maxWidth: 700,
          height: 250,
          margin: "0 auto",
          border: "3px solid #00FF9D",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <BarcodeScannerComponent
          width={"100%"}
          height={"100%"}
          onUpdate={(err, result: any) => {
            if (result) {
              setData(result.text);
            }
          }}
        />
      </div>

      <h3 style={{ marginTop: 20 }}>
        Resultado:{" "}
        <span style={{ color: "#572580", fontWeight: "bold" }}>
          {data || "Aguardando leitura..."}
        </span>
      </h3>
    </div>
  );
};

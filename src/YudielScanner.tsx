import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

export const Barcode128Reader = () => {
  const [data, setData] = useState("");

  const handleScan = (results: any[]) => {
    if (!results || results.length === 0) return;

    // O ScannerResult possui esta estrutura:
    // { rawValue: string; format: string; ... }
    const { rawValue, format } = results[0];

    if (format === "code_128") {
      console.log("Lido:", rawValue, "Formato:", format);
      setData(rawValue);
    }
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Leitor de Código de Barras — Code 128</h2>

      <div
        style={{
          width: "100%",
          maxWidth: 450,
          margin: "20px auto",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <Scanner
          onScan={handleScan}
          onError={(error) => console.error(error)}
          allowMultiple={false}
          formats={["code_128"]}
          constraints={{ facingMode: "environment" }}
          components={{ finder: false }}
        />
      </div>

      <h3 style={{ marginTop: 20 }}>
        Resultado:{" "}
        <strong style={{ color: "#572580" }}>
          {data || "Aguardando leitura..."}
        </strong>
      </h3>
    </div>
  );
};

import { useEffect, useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export const DeviceSelectionExample = () => {
  const [data, setData] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Leitor EAN-13</h2>

      <div className={isMobile ? "scanner-wrapper mobile" : "scanner-wrapper"}>
        <BarcodeScannerComponent
          width="100%"
          height="100%"
          onUpdate={(err, result: any) => {
            console.log('err', err)
            if (result) {
              setData(result.text);
            }
          }}
        />
      </div>

      <h3 style={{ marginTop: 20 }}>
        Resultado:
        <strong style={{ color: "#572580" }}>
          {data || " Aguardando leitura..."}
        </strong>
      </h3>
    </div>
  );
};

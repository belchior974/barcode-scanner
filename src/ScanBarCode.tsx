import { useEffect, useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { BarcodeFormat } from "@zxing/library";

export const DeviceSelectionExample = () => {
  const [data, setData] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);


   useEffect(() => {
    const checkMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    function handleOrientation() {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    }

    handleOrientation(); // executa ao abrir

    window.addEventListener("resize", handleOrientation);
    window.addEventListener("orientationchange", handleOrientation);

    return () => {
      window.removeEventListener("resize", handleOrientation);
      window.removeEventListener("orientationchange", handleOrientation);
    };
  }, []);

   return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Leitor EAN-13</h2>

      <div
        className={
          isMobile && isPortrait
            ? "scanner-wrapper mobile portrait"
            : isMobile && !isPortrait
            ? "scanner-wrapper mobile landscape"
            : "scanner-wrapper"
        }
      >
        <BarcodeScannerComponent
          width="100%"
          height="100%"
          onUpdate={(err, result) => {
            console.log('err', err)
            if (result) {
              console.log('result', result);
              setData(result.getText());
            }
          }}
          formats={[BarcodeFormat.EAN_13]}
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

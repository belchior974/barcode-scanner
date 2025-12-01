import { useEffect, useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
// import { BarcodeFormat } from "@zxing/library";

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

  const extractCode = (result: any) => {
    if (!result) return null;

    return result.text || result?.rawValue || result?.codeResult?.code || null;
  };

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
            if (err) {
              console.log("err", err);
              return;
            }

            const code = extractCode(result);

            if (code) {
              console.log("Código lido:", code);
              setData(code);
            }
          }}
          videoConstraints={{
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }}
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

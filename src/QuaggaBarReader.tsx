import { useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

export const BarcodeScanner = ({ onDetected }: any) => {
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!scannerRef.current || initialized.current) return;

    initialized.current = true;

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },

            // 🔥 melhora foco e nitidez
            advanced: [
              { focusMode: "continuous" },
              { torch: false },
              { zoom: 2 }, // opcional - aproxima o código
            ] as any,
          },
        },

        locator: {
          patchSize: "large",
          halfSample: false,
        },

        numOfWorkers: 1, // 🔥 mobile mais estável

        decoder: {
          readers: ["ean_reader"],
        },

        locate: true,
      },
      (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }
        Quagga.start();
        console.log("🔥 Quagga started with high quality");
      }
    );

    const handleDetected = (result: any) => {
      if (result?.codeResult?.code) {
        onDetected(result.codeResult.code);
      }
    };

    Quagga.onDetected(handleDetected);

    return () => {
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    };
  }, [onDetected]);

  return (
    <div
      id="scanner"
      ref={scannerRef}
      style={{
        width: "100%",
        height: "300px",
        overflow: "hidden",
        position: "relative",
        border: "2px solid #888",
        borderRadius: "10px",
      }}
    />
  );
};

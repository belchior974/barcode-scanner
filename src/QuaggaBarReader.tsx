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
          target: scannerRef.current, // 🔥 evita flicker
          constraints: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: navigator.hardwareConcurrency
          ? Math.max(1, navigator.hardwareConcurrency - 1)
          : 2, // 🔥 mais estável
        decoder: {
          readers: ["ean_reader", "code_128_reader"],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }
        Quagga.start();
        console.log("Quagga started");
      }
    );

    const handleDetected = (result: any) => {
      if (result?.codeResult?.code) {
        onDetected(result);
      }
    };

    Quagga.onDetected(handleDetected);

    return () => {
      console.log("Stopping Quagga…");
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

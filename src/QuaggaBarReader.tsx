import { useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

export const BarcodeScanner = ({ onDetected }: any) => {
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);
  const hasFired = useRef(false);

  useEffect(() => {
    if (!scannerRef.current || initialized.current) return;
    initialized.current = true;

    console.log("📷 Iniciando scanner…");

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            advanced: [{ torch: false }] as any,
          },
        },

        locator: {
          patchSize: "large",
          halfSample: true, // iPhone precisa
        },

        numOfWorkers: 0, // iPhone Safari = obrigatório

        decoder: {
          readers: ["code_128_reader"],
        },

        locate: true,
      },
      (err) => {
        if (err) {
          console.error("❌ Quagga init error:", err);
          return;
        }
        console.log("🚀 Quagga iniciado!");
        Quagga.start();
      }
    );

    const handleDetected = (result: any) => {
      const code = result?.codeResult?.code;
      const confidence = result?.codeResult?.confidence || 0;

      console.log("📡 Tentativa:", code, "Confiança:", confidence);

      if (!code) return;
      if (confidence < 40) return; // filtra ruído
      if (hasFired.current) return;

      hasFired.current = true;

      console.log("✅ Código detectado:", code);
      onDetected(code);

      Quagga.stop();
    };

    Quagga.onDetected(handleDetected);

    return () => {
      console.log("🛑 Encerrando scanner...");
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
        height: "350px",
        overflow: "hidden",
        position: "relative",
        border: "2px solid #888",
        borderRadius: "10px",
      }}
    />
  );
};

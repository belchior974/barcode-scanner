import { useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

export const BarcodeScanner = ({ onDetected }: any) => {
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);
  const hasFired = useRef(false);

  const stopScanner = () => {
    try {
      Quagga.stop();
    } catch (e) {
      console.warn("Scanner já estava parado.");
    }
  };

  const startScanner = () => {
    if (!scannerRef.current) return;

    console.log("📷 Iniciando scanner com orientação…");

    const isPortrait = window.innerHeight > window.innerWidth;

    const aspectRatio = isPortrait ? 1.7 : 0.6;

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            aspectRatio,
          },
        },

        locator: {
          patchSize: "large",
          halfSample: true, // iPhone = obrigatório
        },

        numOfWorkers: 0, // iOS Safari exige 0 workers

        decoder: {
          readers: ["code_128_reader"], // seu padrão
        },

        locate: true,
      },
      (err) => {
        if (err) {
          console.error("❌ Erro ao iniciar Quagga:", err);
          return;
        }

        hasFired.current = false;
        console.log("🚀 Quagga iniciado!");
        Quagga.start();
      }
    );

    Quagga.onDetected(handleDetected);
  };

  const handleDetected = (result: any) => {
    const code = result?.codeResult?.code;
    const confidence = result?.codeResult?.confidence ?? 0;

    console.log("📡 Tentativa:", code, "Confiança:", confidence);

    if (!code) return;
    if (confidence < 40) return;
    if (hasFired.current) return;

    hasFired.current = true;

    console.log("✅ Código detectado:", code);
    onDetected(code);

    stopScanner();
  };

  useEffect(() => {
    if (!scannerRef.current || initialized.current) return;

    initialized.current = true;
    startScanner();

    // 🔄 Reinicia automaticamente quando gira o celular
    const handleResize = () => {
      console.log("🔄 Orientação mudou — reiniciando scanner…");
      stopScanner();

      setTimeout(() => {
        startScanner();
      }, 300);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      console.log("🛑 Encerrando scanner...");
      window.removeEventListener("resize", handleResize);
      Quagga.offDetected(handleDetected);
      stopScanner();
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

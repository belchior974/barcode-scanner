import { useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

export const BarcodeScanner = ({ onDetected }: any) => {
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);
  const hasFired = useRef(false);

  useEffect(() => {
    if (!scannerRef.current || initialized.current) return;
    initialized.current = true;

    const startScanner = async () => {
      try {
        console.log("📷 Solicitando permissão da câmera...");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        // se não tiver vídeo, evita crash
        if (!stream) {
          console.error("❌ Não foi possível acessar a câmera.");
          return;
        }

        console.log("📷 Permissão concedida, iniciando Quagga...");

        Quagga.init(
          {
            inputStream: {
              type: "LiveStream",
              target: scannerRef.current as any,
              constraints: {
                facingMode: "environment",
                width: { ideal: 1920 },
                height: { ideal: 1080 },
              },
            },

            locator: {
              patchSize: "medium",
              halfSample: false,
            },

            numOfWorkers: 1, // iOS precisa ser 1

            decoder: {
              readers: ["ean_reader"],
            },

            locate: true,
          },
          (err) => {
            if (err) {
              console.error("❌ Erro ao iniciar Quagga:", err);
              return;
            }

            Quagga.start();
            console.log("🚀 Quagga iniciado com sucesso!");
          }
        );

        const handleDetected = (result: any) => {
          const code = result?.codeResult?.code;

          if (code && !hasFired.current) {
            hasFired.current = true;

            console.log("📦 Código detectado:", code);

            onDetected(code);

            // opcional: parar para evitar múltiplas leituras
            Quagga.stop();
          }
        };

        Quagga.onDetected(handleDetected);

        return () => {
          console.log("🛑 Finalizando scanner...");
          Quagga.offDetected(handleDetected);
          Quagga.stop();
        };
      } catch (error) {
        console.error("❌ Erro ao acessar câmera:", error);
      }
    };

    startScanner();
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

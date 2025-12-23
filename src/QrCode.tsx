import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export const QrCodeHtml5Reader: React.FC = () => {
  const containerId = "html5-qrcode-reader";
  const scanner = useRef<Html5Qrcode | null>(null);

  const [result, setResult] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    scanner.current = new Html5Qrcode(containerId);

    return () => {
      const instance = scanner.current;
      if (!instance) return;

      try {
        const stopResult = instance.stop();
        if (stopResult instanceof Promise) {
          stopResult.then(() => instance.clear());
        } else {
          instance.clear();
        }
      } catch (err) {
        console.warn("Erro ao finalizar scanner:", err);
      }
    };
  }, []);

  const startScanner = async () => {
    if (!scanner.current) return;

    const config = {
      fps: 8,
      qrbox: { width: 280, height: 280 },
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
    };

    const onSuccess = (decodedText: string) => {
      if (decodedText !== result) {
        setResult(decodedText);
        console.log("QR lido:", decodedText);
      }
    };

    try {
      await scanner.current.start(
        { facingMode: "environment" },
        config,
        onSuccess,
        () => {}
      );

      setRunning(true);
    } catch (err) {
      console.error("Erro ao iniciar o scanner:", err);
    }
  };

  const stopScanner = async () => {
    if (!scanner.current) return;

    try {
      await scanner.current.stop();
      await scanner.current.clear();
      setRunning(false);
    } catch (err) {
      console.error("Erro ao parar:", err);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Leitor de QR Code (html5-qrcode)</h2>

      <div
        id={containerId}
        style={{
          width: "100%",
          maxWidth: 420,
          height: 300,
          margin: "20px auto",
        }}
      />

      {!running ? (
        <button onClick={startScanner}>Iniciar Leitura</button>
      ) : (
        <button onClick={stopScanner}>Parar Leitura</button>
      )}

      <div style={{ marginTop: 32, fontSize: 18 }}>
        <strong>Resultado:</strong>{" "}
        <span style={{ color: "#fff" }}>
          {result ?? "Aguardando leitura..."}
        </span>
      </div>
    </div>
  );
};

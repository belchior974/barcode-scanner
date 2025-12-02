import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export const BarcodeHtml5Reader: React.FC = () => {
  const containerId = "html5-barcode-reader";
  const scanner = useRef<Html5Qrcode | null>(null);

  const [result, setResult] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    scanner.current = new Html5Qrcode(containerId);

    return () => {
      const instance = scanner.current;
      if (!instance) return;

      try {
        // Algumas versões retornam Promise, outras não — por isso usamos await dentro de try
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
      fps: 10,
      qrbox: { width: 420, height: 120 },
      formatsToSupport: [
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.EAN_13,
      ],
    };

    const onSuccess = (decodedText: string) => {
      if (decodedText !== result) {
        setResult(decodedText);
        console.log("Lido:", decodedText);
      }
    };

    const onError = () => {};

    try {
      await scanner.current.start(
        { facingMode: "environment" },
        config,
        onSuccess,
        onError
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
      <h2>Leitor Code 128 + EAN-13 (html5-qrcode)</h2>

      <div
        id={containerId}
        style={{
          width: "100%",
          maxWidth: 600,
          margin: "20px auto",
        }}
      />

      {!running ? (
        <button onClick={startScanner}>Iniciar Leitura</button>
      ) : (
        <button onClick={stopScanner}>Parar Leitura</button>
      )}

      <div style={{ marginTop: 20, fontSize: 18 }}>
        <strong>Resultado:</strong>{" "}
        <span style={{ color: "#572580" }}>
          {result ?? "Aguardando leitura..."}
        </span>
      </div>
    </div>
  );
};

import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from "@zxing/library";

export const BarcodeScanner = ({ onDetected }: { onDetected: (code: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasFired = useRef(false);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  // 🔔 Som ao detectar (beep)
  const playBeep = () => {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA="
    );
    audio.play().catch(() => {});
  };

  // 📳 Vibração ao detectar
  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(150);
    }
  };

  useEffect(() => {
    const start = async () => {
      try {
        console.log("📷 Solicitando câmera...");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true"); // iPhone fix
          await videoRef.current.play();
        }

        // ZXing hints
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]);
        hints.set(DecodeHintType.TRY_HARDER, true);

        readerRef.current = new BrowserMultiFormatReader(hints);

        readerRef.current.decodeFromVideoDevice(
          null,
          videoRef.current!,
          (result, err) => {
            if (result) {
              const code = result.getText();

              if (!hasFired.current) {
                hasFired.current = true;

                playBeep();
                vibrate();

                console.log("✅ Código detectado:", code);
                onDetected(code);
              }
            }
          }
        );
      } catch (error) {
        console.error("❌ Erro ao iniciar scanner:", error);
      }
    };

    start();

    return () => {
      console.log("🛑 Encerrando ZXing...");
      readerRef.current?.reset();
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [onDetected]);

  return (
    <div
      style={{
        width: "100%",
        height: "350px",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        border: "2px solid #999",
      }}
    >
      <video
        ref={videoRef}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* 🎯 Retícula central */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: "2px",
          background: "rgba(255, 0, 0, 0.8)",
          transform: "translateY(-50%)",
        }}
      />

      {/* Box guia */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80%",
          height: "40%",
          border: "2px solid rgba(255,0,0,0.6)",
          transform: "translate(-50%, -50%)",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";

export const BarcodeScanner = ({ onDetected }: any) => {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (scannerRef.current && !scanning) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              width: 640,
              height: 480,
              facingMode: "environment", // or 'user'
            },
          },
          locator: {
            patchSize: "medium",
            halfSample: true,
          },
          numOfWorkers: 0, // Set to 0 for single thread, or more for multi-threading
          decoder: {
            readers: ["ean_reader", "code_128_reader"], // Specify barcode types
          },
          locate: true,
        },
        function (err) {
          if (err) {
            console.error(err);
            return;
          }
          Quagga.start();
          setScanning(true);
        }
      );

      Quagga.onDetected(onDetected); // Attach the detection callback

      return () => {
        Quagga.offDetected(onDetected);
        Quagga.stop();
        setScanning(false);
      };
    }
  }, [onDetected, scanning]);

  return <div id="interactive" className="viewport" ref={scannerRef} />;
};

export default BarcodeScanner;

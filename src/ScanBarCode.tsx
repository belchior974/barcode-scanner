import { Scanner } from "@yudiel/react-qr-scanner";

export const DeviceSelectionExample = () => {
  const handleScan = (detectedCodes: any) => {
    console.log("Detected codes:", detectedCodes);
    // detectedCodes is an array of IDetectedBarcode objects
    detectedCodes.forEach((code: any) => {
      alert(`${code.rawValue}`);
      console.log(`Format: ${code.format}, Value: ${code.rawValue}`);
    });
  };

  return (
    <Scanner
      onScan={handleScan}
      onError={(error) => console.error(error)}
      // Aqui você limita para ler apenas o tipo desejado
      formats={["ean_13"]}
      //   constraints={{
      //     video: { facingMode: "environment" }
      //   }}
    />
  );
};

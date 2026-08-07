"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

const ScanPreview = () => {
  const [accessGranted, setAccessGranted] = React.useState<boolean | null>(
    null,
  );
  const [error, setError] = React.useState<string | null>(null);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (navigator?.mediaDevices && accessGranted === null) {
      (async () => {
        try {
          setAccessGranted(true);
          setError(null);

          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });

          if (stream && videoRef.current?.srcObject === null) {
            const videoElement = videoRef.current;
            videoElement.srcObject = stream;
            videoElement.play();
          }
        } catch (error) {
          setAccessGranted(false);
          setError("Error accessing camera. Please check your permissions.");
          console.error("Error accessing camera:", error);
        }
      })();
    }
  });

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {accessGranted != true && <h2>Please Allow Camera Access</h2>}
      <h3 className="text-lg font-semibold mb-2">Scan Preview</h3>
      <p className="text-gray-500">Scan results will appear here.</p>

      <video ref={videoRef}></video>
      <canvas className="hidden" ref={canvasRef}></canvas>

      <Button
        size="lg"
        className="text-xl"
        onClick={() => console.log("Button clicked!")}
      >
        Scan TPN Label
      </Button>
    </div>
  );
};

export default ScanPreview;

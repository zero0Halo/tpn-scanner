"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

const ScanPreview = () => {
  const [accessGranted, setAccessGranted] = React.useState<boolean | null>(
    null,
  );
  const [error, setError] = React.useState<string | null>(null);
  const [height, setHeight] = React.useState<number>(0);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const photoRef = React.useRef<HTMLImageElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  function takePicture() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    if (width && height && videoRef.current) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(videoRef.current, 0, 0, width, height);

      const data = canvas.toDataURL("image/png");
      console.log(data);
      photoRef.current?.setAttribute("src", data);
    }
  }

  const width = 320;

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
            await videoElement.play();

            const height =
              videoElement?.videoHeight / (videoElement?.videoWidth / width);
            setHeight(height);

            videoElement.setAttribute("width", width + "");
            videoElement.setAttribute("height", height + "");
            canvasRef?.current?.setAttribute("width", width + "");
            canvasRef?.current?.setAttribute("height", height + "");
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
      <canvas ref={canvasRef}></canvas>
      <img ref={photoRef} alt="Captured photo" />
      <Button size="lg" className="text-xl" onClick={takePicture}>
        Scan TPN Label
      </Button>
    </div>
  );
};

export default ScanPreview;

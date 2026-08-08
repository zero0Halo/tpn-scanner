/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { PaddleOCR } from "@paddleocr/paddleocr-js";
import { Button } from "@/components/ui/button";

const ScanPreview = () => {
  const [accessGranted, setAccessGranted] = React.useState<boolean | null>(
    null,
  );
  const [error, setError] = React.useState<string | null>(null);
  const [height, setHeight] = React.useState<number>(0);
  const [photoTaken, setPhotoTaken] = React.useState<boolean>(false);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const photoRef = React.useRef<HTMLImageElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const width = 1000;

  async function retry() {
    setPhotoTaken(false);
    videoRef.current?.classList.remove("hidden");
    photoRef.current?.classList.add("hidden");
    await videoRef.current?.play();
  }

  async function takePicture() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    if (width && height && videoRef.current) {
      canvas.width = width;
      canvas.height = height;
      context.filter = `brightness(${1.1}) contrast(${1.25})`;
      context.drawImage(videoRef.current, 0, 0, width, height);

      const data = canvas.toDataURL("image/png");
      photoRef.current?.setAttribute("src", data);
      await videoRef.current?.pause();
      videoRef.current?.classList.add("hidden");
      photoRef.current?.classList.remove("hidden");

      const ocr = await PaddleOCR.create({
        lang: "en",
        ocrVersion: "PP-OCRv5",
        ortOptions: {
          backend: "auto",
        },
      });

      const [result] = await ocr.predict(photoRef.current as HTMLImageElement);
      console.log(result.items);

      setPhotoTaken(true);
    }
  }

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

      <Button size="lg" className="text-xl" onClick={takePicture}>
        Scan TPN Label
      </Button>

      <video ref={videoRef}></video>
      <canvas className="hidden" ref={canvasRef}></canvas>
      <img className="hidden" ref={photoRef} alt="Captured photo" />

      {photoTaken && (
        <>
          <Button size="lg" className="text-xl" onClick={retry}>
            Retry
          </Button>
          <Button size="lg" className="text-xl">
            Continue
          </Button>
        </>
      )}
    </div>
  );
};

export default ScanPreview;

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
  const [photoTaken, setPhotoTaken] = React.useState<boolean>(false);
  const [canvasHeight, setCanvasHeight] = React.useState<number>(0);
  const [canvasWidth, setCanvasWidth] = React.useState<number>(0);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const photoRef = React.useRef<HTMLImageElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  function stopVideoStream() {
    const video = videoRef.current;

    if (video) {
      video?.pause();
      const stream = video.srcObject as MediaStream | null;
      stream?.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  }

  async function takePicture() {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    if (videoRef.current) {
      context.filter = `brightness(${1.1}) contrast(${1.25})`;
      context.drawImage(videoRef.current, 0, 0, canvasWidth, canvasHeight);

      const data = canvas.toDataURL("image/png");

      photoRef.current?.setAttribute("src", data);

      stopVideoStream();

      videoRef.current?.classList.add("hidden");
      photoRef.current?.classList.remove("hidden");

      const ocr = await PaddleOCR.create({
        lang: "en",
        ocrVersion: "PP-OCRv5",
        ortOptions: {
          backend: "auto",
        },
      });

      const [result] = await ocr.predict(
        canvasRef.current as HTMLCanvasElement,
      );
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
            const { height: videoHeight, width: videoWidth } = stream
              .getVideoTracks()[0]
              .getSettings();
            const ratio =
              videoWidth && videoHeight ? videoWidth / videoHeight : 1;
            const height =
              videoHeight && videoHeight < 1000 ? 1000 : (videoHeight ?? 1000);
            const width =
              height && videoWidth ? Math.floor(height * ratio) : 1000;
            const videoElement = videoRef.current;

            setCanvasHeight(height);
            setCanvasWidth(width);

            videoElement.srcObject = stream;
            await videoElement.play();

            canvasRef?.current?.setAttribute("width", `${width}`);
            canvasRef?.current?.setAttribute("height", `${height}`);
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

      {!photoTaken ? (
        <Button
          size="lg"
          className="text-xl w-full  max-w-[1000px]"
          onClick={takePicture}
        >
          Scan TPN Label
        </Button>
      ) : (
        <Button size="lg" className="text-xl w-full max-w-[1000px]">
          Continue
        </Button>
      )}

      <video className="w-full max-w-[1000px]" ref={videoRef}></video>
      <canvas className="hidden" ref={canvasRef}></canvas>
      <img
        className="hidden w-full max-w-[1000px]"
        ref={photoRef}
        alt="Captured photo"
      />
    </div>
  );
};

export default ScanPreview;

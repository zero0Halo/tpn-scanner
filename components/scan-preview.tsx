/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PaddleOCR } from "@paddleocr/paddleocr-js";
import { Button } from "@/components/ui/button";
import toBlob from "@/lib/utils/toBlob";
import saveData from "@/lib/utils/saveData";

const ScanPreview = () => {
  const router = useRouter();

  const [accessGranted, setAccessGranted] = React.useState<boolean | null>(
    null,
  );
  const [cameraLoading, setCameraLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [photoTaken, setPhotoTaken] = React.useState<boolean>(false);
  const [canvasHeight, setCanvasHeight] = React.useState<number>(0);
  const [canvasWidth, setCanvasWidth] = React.useState<number>(0);
  const [processing, setProcessing] = React.useState<boolean>(false);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const photoRef = React.useRef<HTMLImageElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  function stopVideoStream() {
    const video = videoRef.current;

    if (video) {
      video.pause();
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

      setPhotoTaken(true);
    }
  }

  async function handleContinue() {
    if (!canvasRef.current) return;

    setProcessing(true);

    const blob = await toBlob(canvasRef.current);
    const formData = new FormData();
    const ocr = await PaddleOCR.create({
      lang: "en",
      ocrVersion: "PP-OCRv5",
      ortOptions: {
        backend: "auto",
      },
    });
    const [result] = await ocr.predict(canvasRef.current as HTMLCanvasElement);

    formData.append("paddleData", JSON.stringify(result.items));
    formData.append("image", blob);

    try {
      const response = await fetch("/api/open-ai/read-scan", {
        method: "POST",
        body: formData,
      });
      const { result: apiResult } = await response.json();

      if (apiResult?.ingredients && apiResult?.ingredients.length === 0) {
        setError("The label did not have any ingredients. Please try again.");
        return;
      }

      const saveResultId = await saveData({
        image: blob,
        labelData: apiResult,
      });

      console.log("Data saved successfully:", saveResultId);
      router.push(`/edit/${saveResultId}`);
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setProcessing(false);
    }
  }

  async function handleGrantAccess() {
    setCameraLoading(true);

    if (navigator?.mediaDevices) {
      try {
        setError(null);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
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
          setAccessGranted(true);

          canvasRef?.current?.setAttribute("width", `${width}`);
          canvasRef?.current?.setAttribute("height", `${height}`);
        }
      } catch (error) {
        setAccessGranted(false);
        setError("Error accessing camera. Please check your permissions.");
        console.error("Error accessing camera:", error);
      } finally {
        setCameraLoading(false);
      }
    } else {
      setCameraLoading(false);
      setError("Camera access is not available on this device.");
    }
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {accessGranted !== true && !cameraLoading && (
        <>
          <h2 className="pb-4 text-lg font-semibold">
            Please allow camera access
          </h2>

          <Button
            size="lg"
            className="h-12 w-full bg-emerald-600 text-base text-white hover:bg-emerald-700"
            onClick={handleGrantAccess}
          >
            Start Camera
          </Button>
        </>
      )}

      {cameraLoading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-sky-800" />
          <p className="text-sm text-gray-500">Starting camera...</p>
        </div>
      )}

      {accessGranted === true && (
        <>
          <h2 className="pb-4 text-lg font-semibold">Scan Preview</h2>

          {!photoTaken ? (
            <Button
              size="lg"
              className="h-12 w-full bg-emerald-600 text-base text-white hover:bg-emerald-700"
              onClick={takePicture}
            >
              Scan TPN Label
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-12 w-full bg-emerald-600 text-base text-white hover:bg-emerald-700"
              disabled={processing || error !== null}
              onClick={handleContinue}
            >
              Continue
            </Button>
          )}
        </>
      )}

      <video
        className={accessGranted === true && !photoTaken ? "w-full" : "hidden"}
        ref={videoRef}
      />

      <canvas className="hidden" ref={canvasRef} />

      <img
        className={photoTaken ? "w-full" : "hidden"}
        ref={photoRef}
        alt="Captured photo"
      />

      {photoTaken && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Photo Taken. Click continue.
        </div>
      )}

      {processing && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-sky-800" />
          <p className="text-sm text-gray-500">Processing image...</p>
        </div>
      )}
    </div>
  );
};

export default ScanPreview;

async function toBlob(canvasData: HTMLCanvasElement): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvasData.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to create blob"));
      }
    }, "image/jpeg");
  });
}

export default toBlob;

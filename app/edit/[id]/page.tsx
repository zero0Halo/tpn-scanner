/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import React from "react";

function EditPage() {
  const params = useParams();
  const { id } = params;
  const scanId = Array.isArray(id) ? id[0] : id;

  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const request = indexedDB.open("LabelInformationDB", 2);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("scans", "readonly");
      const store = transaction.objectStore("scans");

      if (!scanId) {
        return;
      }

      const entry = store.get(scanId);

      entry.onsuccess = () => {
        const scan = entry.result;

        if (!scan) return;

        const url = URL.createObjectURL(scan.image);

        setImageUrl(url);
      };
    };
  }, [scanId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Edit Page</h1>
      <p className="text-lg text-gray-600">
        This is the edit page. You can edit your content here.
      </p>

      <div>{imageUrl && <img src={imageUrl} alt="TPN label" />}</div>
    </div>
  );
}

export default EditPage;

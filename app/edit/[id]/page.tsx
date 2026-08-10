/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { TpnLabel } from "@/lib/types";

function EditPage() {
  const params = useParams();
  const { id } = params;
  const scanId = Array.isArray(id) ? id[0] : id;

  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [labelData, setLabelData] = React.useState<TpnLabel | null>(null);

  const { control, register, reset } = useForm<TpnLabel>();

  const { fields } = useFieldArray({
    control,
    name: "ingredients",
  });

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
        setLabelData(scan.labelData);
        reset(scan.labelData);
      };
    };
  }, [reset, scanId]);

  console.log(labelData);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Edit Page</h1>
      <p className="text-lg text-gray-600">
        This is the edit page. You can edit your content here.
      </p>

      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`ingredients.${index}.name`)} />
          <input {...register(`ingredients.${index}.amount`)} />
          <input {...register(`ingredients.${index}.unit`)} />
        </div>
      ))}

      <div>{imageUrl && <img src={imageUrl} alt="TPN label" />}</div>
    </div>
  );
}

export default EditPage;

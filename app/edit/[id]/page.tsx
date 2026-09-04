/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { TpnLabel } from "@/lib/types";

function EditPage() {
  const params = useParams();
  const { id } = params;
  const scanId = Array.isArray(id) ? id[0] : id;

  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

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
        setLoading(false);
        reset(scan.labelData);
      };
    };
  }, [reset, scanId]);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="w-full max-w-md px-4">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-sky-800" />
            <p className="text-sm text-gray-500">Loading label data...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="pb-4 text-lg font-semibold">
                Review & Edit Label
              </h2>
              <p className="text-sm text-gray-600">
                Check the scanned values and correct anything that looks wrong.
              </p>
            </div>

            <section>
              <h3 className="mb-2 text-md font-semibold">Ingredients</h3>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                  >
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Ingredient
                    </label>

                    <input
                      {...register(`ingredients.${index}.name`)}
                      className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-base"
                    />

                    <div className="grid grid-cols-[1fr_100px] gap-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                          Amount
                        </label>

                        <input
                          {...register(`ingredients.${index}.amount`, {
                            valueAsNumber: true,
                          })}
                          type="number"
                          step="any"
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                          Unit
                        </label>

                        <input
                          {...register(`ingredients.${index}.unit`)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mt-16 text-md font-semibold">Scanned Label</h3>

              <img
                src={imageUrl ?? undefined}
                alt="Scanned TPN Label"
                className="mt-6 w-full rounded-lg border border-gray-200"
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default EditPage;

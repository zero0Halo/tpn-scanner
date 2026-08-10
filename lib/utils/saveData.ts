import { TpnLabel } from "@/lib/types";

function saveData({ image, labelData }: { image: Blob; labelData: TpnLabel }) {
  return new Promise<string | boolean>((resolve, reject) => {
    const request = indexedDB.open("LabelInformationDB", 2);
    const id = crypto.randomUUID();

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("scans")) {
        db.createObjectStore("scans", {
          keyPath: "id",
        });
      }
    };
    request.onerror = () => {
      console.error("Why didn't you allow my web app to use IndexedDB?!");
      reject("IndexedDB error");
    };
    request.onsuccess = (event) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result;

      const transaction = db.transaction("scans", "readwrite");
      const store = transaction.objectStore("scans");

      store.add({
        id,
        image,
        labelData,
      });

      transaction.oncomplete = () => {
        resolve(id);
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    };
  });
}

export default saveData;

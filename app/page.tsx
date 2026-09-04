import ScanPreview from "@/components/scan-preview";

export default function Home() {
  return (
    <>
      <header className="border-b bg-sky-800 text-white">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <h1 className="text-center text-lg font-semibold">TPN Scanner</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-12 font-sans">
        <ScanPreview />
      </main>
    </>
  );
}

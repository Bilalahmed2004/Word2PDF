import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import Header from "./components/Header.jsx";
import UploadBox from "./components/UploadBox.jsx";
import FilePreview from "./components/FilePreview.jsx";
import { convertToPdf } from "./convertToPdf.js";

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | converting | done
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState("");

  const reset = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFile(null);
    setPdfUrl(null);
    setStatus("idle");
    setError("");
  };

  const handleFileSelected = (selected) => {
    if (!selected.name.toLowerCase().endsWith(".docx")) {
      setError("Please select a valid .docx file.");
      return;
    }
    reset();
    setFile(selected);
  };

  const handleConvert = async () => {
    setStatus("converting");
    setError("");
    try {
      const blob = await convertToPdf(file);
      setPdfUrl(URL.createObjectURL(blob));
      setStatus("done");
    } catch {
      setError("Conversion failed. Please try again.");
      setStatus("idle");
    }
  };

  const pdfName = file ? file.name.replace(/\.docx$/i, "") + ".pdf" : "file.pdf";

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Convert Word to PDF
          </h1>
          <p className="mt-2 text-gray-600">
            Convert your Word documents to PDF easily
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-md sm:p-8">
          {!file ? (
            <UploadBox onFileSelected={handleFileSelected} />
          ) : (
            <div className="space-y-5">
              <FilePreview
                file={file}
                onRemove={reset}
                disabled={status === "converting"}
              />

              {status === "idle" && (
                <button
                  onClick={handleConvert}
                  className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                  Convert to PDF
                </button>
              )}

              {status === "converting" && (
                <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 px-5 py-3 font-medium text-blue-700">
                  <Loader2 size={20} className="animate-spin" />
                  Converting...
                </div>
              )}

              {status === "done" && (
                <div className="space-y-3">
                  <a
                    href={pdfUrl}
                    download={pdfName}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <Download size={20} />
                    Download PDF
                  </a>
                  <p className="text-center text-xs text-gray-500">
                    Layout may differ slightly from the original Word file.
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Word2PDF. All rights reserved.
      </footer>
    </div>
  );
}

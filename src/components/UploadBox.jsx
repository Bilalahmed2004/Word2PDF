import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function UploadBox({ onFileSelected }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (file) onFileSelected(file);
    if (inputRef.current) inputRef.current.value = ""; // allow re-selecting same file
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50"
      }`}
    >
      <UploadCloud size={48} className="mb-4 text-blue-600" />
      <p className="mb-1 text-lg font-medium text-gray-800">
        Drag &amp; drop your DOCX file here
      </p>
      <p className="mb-5 text-sm text-gray-500">or</p>

      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700"
      >
        Choose File
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".docx"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <p className="mt-4 text-xs text-gray-400">Only .docx files are supported</p>
    </div>
  );
}

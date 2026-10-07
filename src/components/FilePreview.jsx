import { FileText, X } from "lucide-react";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FilePreview({ file, onRemove, disabled }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
        <FileText size={24} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900">{file.name}</p>
        <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X size={16} />
        Remove File
      </button>
    </div>
  );
}

import { FileText } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-4">
        <div className="rounded-lg bg-blue-600 p-1.5 text-white">
          <FileText size={20} />
        </div>
        <span className="text-lg font-bold text-gray-900">Word2PDF</span>
      </div>
    </header>
  );
}

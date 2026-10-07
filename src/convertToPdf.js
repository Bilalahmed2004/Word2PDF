import mammoth from "mammoth";
import html2pdf from "html2pdf.js";

// Real DOCX -> PDF conversion that runs fully in the browser.
// Step 1: mammoth turns the DOCX into HTML.
// Step 2: html2pdf turns that HTML into a PDF.
//
// NOTE: This is an approximation. Text, headings, lists, tables and images
// usually work, but the layout will not be 100% identical to Word
// (fonts, headers/footers, page breaks, complex formatting may differ).
//
// For pixel-perfect results, call a server API (e.g. LibreOffice) here:
//   const formData = new FormData();
//   formData.append("file", file);
//   const res = await fetch("https://your-api.com/convert", { method: "POST", body: formData });
//   return await res.blob();

const PDF_STYLES = `
  .pdf-doc { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #000; background: #fff; width: 700px; padding: 8px; }
  .pdf-doc h1 { font-size: 26px; font-weight: bold; margin: 16px 0 8px; }
  .pdf-doc h2 { font-size: 22px; font-weight: bold; margin: 14px 0 8px; }
  .pdf-doc h3 { font-size: 18px; font-weight: bold; margin: 12px 0 6px; }
  .pdf-doc p { margin: 0 0 10px; }
  .pdf-doc ul { list-style: disc; padding-left: 24px; margin: 0 0 10px; }
  .pdf-doc ol { list-style: decimal; padding-left: 24px; margin: 0 0 10px; }
  .pdf-doc table { border-collapse: collapse; width: 100%; margin-bottom: 10px; }
  .pdf-doc td, .pdf-doc th { border: 1px solid #999; padding: 4px 6px; }
  .pdf-doc img { max-width: 100%; }
`;

export async function convertToPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

  const container = document.createElement("div");
  container.innerHTML = `<style data-keep>${PDF_STYLES}</style><div class="pdf-doc">${html}</div>`;

  const blob = await html2pdf()
    .set({
      margin: 10,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: {
        scale: 2,
        // Tailwind v4 uses colors html2canvas can't read, so drop the page's
        // stylesheets from the copy being rendered (we keep our own styles).
        onclone: (doc) => {
          doc
            .querySelectorAll('style:not([data-keep]), link[rel="stylesheet"]')
            .forEach((el) => el.remove());
        },
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(container)
    .outputPdf("blob");

  return blob;
}

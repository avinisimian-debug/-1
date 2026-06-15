import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function sanitizeFileName(name: string): string {
  return (
    name.replace(/\.[^/.]+$/, "").replace(/[^\w\s-]/g, "").trim() || "report"
  );
}

export async function downloadPdfFromElement(
  element: HTMLElement,
  fileName: string,
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
}

export async function downloadPdfReport(
  element: HTMLElement,
  sourceFileName: string,
): Promise<void> {
  const base = sanitizeFileName(sourceFileName);
  await downloadPdfFromElement(element, `${base}-report.pdf`);
}

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportElementToPDF({
  element,
  fileName = "report.pdf",
  margin = 10,
  orientation = "landscape",
  unit = "mm",
}) {
  if (!element) throw new Error("exportElementToPDF: element is required");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  // Canvas size in px
  const pxWidth = canvas.width;
  const pxHeight = canvas.height;

  // Convert px -> mm based on 96dpi assumption
  const mmWidth = (pxWidth * 25.4) / 96;
  const mmHeight = (pxHeight * 25.4) / 96;

  const pdf = new jsPDF({
    orientation,
    unit,
    format: [mmWidth + margin * 2, mmHeight + margin * 2],
  });

  pdf.addImage(imgData, "PNG", margin, margin, mmWidth, mmHeight);

  pdf.save(fileName);
}

type TableCell = {
  text: string | number | boolean;
  color?: string;
  width?: number;
  height?: number;
  align?: "left" | "center" | "right";
  fontSize?: number; // Added: per-cell font size
  bold?: boolean;    // Added: per-cell bold toggle
};

export type TableRow = TableCell[];

export function drawFlexibleTable(
  doc: PDFKit.PDFDocument,
  rows: TableRow[],
  options?: {
    title?: string;
    fontSize?: number;
    rowHeight?: number;
    fontPath?: string;      // Regular font path
    fontBoldPath?: string;  // Bold font path 
  }
) {
  const startX = 20;
  const defaultRowHeight = options?.rowHeight || 20;
  const defaultFontSize = options?.fontSize || 10;

  const regularFont = options?.fontPath || "Helvetica";
  const boldFont = options?.fontBoldPath || "Helvetica-Bold";

  if (options?.title) {
    doc.font(boldFont).fontSize(16).fillColor("#000000").text(options.title, { align: "left" });
    doc.moveDown(0.5);
  }

  rows.forEach((row) => {
    let currentX = startX;
    const y = doc.y;

    // --- 1. DYNAMIC HEIGHT CALCULATION ---
    // We measure every cell to find the one that needs the most vertical space
    const rowContentHeight = Math.max(
      ...row.map((cell) => {
        const colWidth = cell.width || 100;
        const cellFontSize = cell.fontSize || defaultFontSize;
        const font = cell.bold ? boldFont : regularFont;

        // Temporarily set font/size to measure accurately
        doc.font(font).fontSize(cellFontSize);

        return doc.heightOfString(String(cell.text ?? "-"), {
          width: colWidth - 10, // padding adjustment
          align: cell.align || "left",
        });
      }),
      defaultRowHeight
    );

    const padding = 8; // Extra breathing room top/bottom
    const finalRowHeight = rowContentHeight + padding;

    // --- 2. PAGE BREAK CHECK ---
    if (y + finalRowHeight > doc.page.height - 50) {
      doc.addPage();
    }

    // --- 3. DRAWING ---
    row.forEach((cell) => {
      const colWidth = cell.width || 100;
      const cellFontSize = cell.fontSize || defaultFontSize;
      const font = cell.bold ? boldFont : regularFont;

      // Draw border
      doc.strokeColor("#000000")
        .lineWidth(0.5)
        .rect(currentX, y, colWidth, finalRowHeight)
        .stroke();

      // Set Font and Size
      doc.font(font).fontSize(cellFontSize).fillColor(cell.color || "#333333");

      // Calculate vertical centering for the wrapped text
      const textHeight = doc.heightOfString(String(cell.text ?? "-"), { width: colWidth - 10 });
      const verticalOffset = (finalRowHeight - textHeight) / 2;

      doc.text(String(cell.text ?? "-"), currentX + 5, y + verticalOffset, {
        width: colWidth - 10,
        align: cell.align || "left",
      });

      currentX += colWidth;
    });

    doc.y = y + finalRowHeight;
  });
  doc.moveDown(0.5);
}

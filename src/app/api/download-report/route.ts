export const runtime = "nodejs"

import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"
import path from "path"

function generateRandomTable(rows = 6, cols = 4): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () =>
      Math.floor(Math.random() * 100)
    )
  )
}

export async function GET() {
  try {
    const tableData = generateRandomTable()

    const fontPath = path.join(
      process.cwd(),
      "public/fonts/Roboto-Regular.ttf"
    )

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
      font: fontPath,
    })

    const buffers: Buffer[] = []

    doc.on("data", (chunk) => buffers.push(chunk))

    // 👇 WAIT for pdfkit to finish writing
    const pdfDone = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => {
        resolve(Buffer.concat(buffers))
      })
      doc.on("error", reject)
    })

    // ---------- WRITE CONTENT ----------
    doc.fontSize(18).text("Random Table", { align: "center" })
    doc.moveDown(2)

    const startX = doc.x
    const startY = doc.y
    const cellWidth = 100
    const cellHeight = 30

    tableData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = startX + colIndex * cellWidth
        const y = startY + rowIndex * cellHeight

        doc.rect(x, y, cellWidth, cellHeight).stroke()
        doc.text(String(cell), x, y + 10, {
          width: cellWidth,
          align: "center",
        })
      })
    })

    doc.end()
    // ---------- END CONTENT ----------

    const pdfBuffer = await pdfDone

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="random-table-pdfkit.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("PDF generation failed:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
}

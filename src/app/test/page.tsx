'use client'
import { Button } from "@/components/ui/button";
import axios from "axios";


const Text = () => {

  const test = async () => {
    try {
      const response = await axios.get("/api/download-report", {
        responseType: "blob", // 👈 CRITICAL
      })

      const blob = new Blob([response.data], {
        type: "application/pdf",
      })

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "random-table-pdfkit.pdf"
      document.body.appendChild(a)
      a.click()

      a.remove()
      window.URL.revokeObjectURL(url)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button onClick={test}>Submit</Button>
  )
}

export default Text;

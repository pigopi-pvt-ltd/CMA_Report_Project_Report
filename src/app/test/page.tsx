'use client'
import { Button } from "@/components/ui/button";
import axios from "axios";


const Text = () => {

  const test = async () => {
    try {
      const response = await axios.post("/api/download-report",
        {
          projectId: '6979f8edd24557c353410d8a'
        },
        {
          responseType: "blob", // 👈 CRITICAL
          withCredentials: true
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

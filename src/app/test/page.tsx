'use client'
import { Button } from "@/components/ui/button";
import axios from "axios";


const Text = () => {

  const test = async () => {
    try {
      const response = await axios.post("/api/project-report", {
        "businessName": "Anik Manufacturing Pvt Ltd",
        "businessType": "Small Scale Manufacturing",

        "industryType": "manufacturing",
        "loanType": "msme",

        "businessRequirements": {
          "machinery": 850000,
          "land": 1200000,
          "building": 500000,
          "workingExpenses": 150000
        },

        "monthlyExpenses": {
          "salary": 120000,
          "rent": 30000,
          "electricityExpenses": 15000,
          "purchaseOfRawMaterials": 200000
        },

        "productName": "Industrial Plastic Components",

        "salesType": "monthly",
        "salesRevenue": 450000,

        "loanPeriod": 7,

        "personalDetails": {
          "fullName": "Anik Rawat",
          "email": "anik@example.com",
          "mobile": "9876543210",
          "businessMobile": "9123456789",
          "personalAddress": "123, Main Street, Dehradun, Uttarakhand",
          "businessAddress": "Industrial Area, Sector 5, Dehradun",
          "gender": "male",
          "category": "general",
          "educationQualification": "graduate",
          "workExperience": "3to5"
        },

        "businessDetails": {
          "businessName": "Anik Manufacturing Pvt Ltd",
          "legalConstitution": "privateltd",
          "employementPotential": "5to10",
          "businessStartDate": "6to12monthsAgo"
        }
      })

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

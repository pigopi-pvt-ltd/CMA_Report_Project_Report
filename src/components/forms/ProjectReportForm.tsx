"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Field } from '../ui/field';
import { projectReportSchema, projectReportType } from "@/Schemas/projectReportSchema";
import Step1 from "./form-steps/Step1";
import Step2 from "./form-steps/Step2";
import Step3 from "./form-steps/Step3";
import Step4 from "./form-steps/Step4";
import Step5 from "./form-steps/Step5";
import Step6 from "./form-steps/Step6";
import Step7 from "./form-steps/Step7";
import Step8 from "./form-steps/Step8";
import Step9 from "./form-steps/Step9";
import Step10 from "./form-steps/Step10";

const variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.05,
      ease: "easeInOut",
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -50 : 50,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  }),
};


export const ProjectReportForm = () => {


  const steps = [
    {
      title: "Step 1",
      description: "",
      fields: ["businessName"],
      schema: projectReportSchema.pick({
        businessName: true
      })
    },
    {
      title: "Step 2",
      description: "",
      fields: ["businessType"],
      schema: projectReportSchema.pick({
        businessType: true
      })
    },
    {
      title: "Step 3",
      description: "",
      fields: ["industryType"],
      schema: projectReportSchema.pick({
        industryType: true
      })
    },
    {
      title: "Step 4",
      description: "",
      fields: ["loanType"],
      schema: projectReportSchema.pick({
        loanType: true
      })
    },
    {
      title: "Step 5",
      description: "",
      fields: ["businessRequirements"],
      schema: projectReportSchema.pick({
        businessRequirements: true
      })
    },
    {
      title: "Step 6",
      description: "",
      fields: ["monthlyExpenses"],
      schema: projectReportSchema.pick({
        monthlyExpenses: true
      })
    },
    {
      title: "Step 7",
      description: "",
      fields: ["revenueDetails"],
      schema: projectReportSchema.pick({
        revenueDetails: true
      })
    },
    {
      title: "Step 8",
      description: "",
      fields: ["loanPeriod"],
      schema: projectReportSchema.pick({
        loanPeriod: true
      })
    },
    {
      title: "Step 9",
      description: "",
      fields: ["personalDetails"],
      schema: projectReportSchema.pick({
        personalDetails: true
      })
    },
    {
      title: "Step 10",
      description: "",
      fields: ["businessDetails"],
      schema: projectReportSchema.pick({
        businessDetails: true
      })
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const currentForm = steps[currentStep];

  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const defaultValues: projectReportType = {
    // step 1
    businessName: "",

    // step 2
    businessType: "",

    // step 3 (enum → use undefined, validated only when triggered)
    industryType: undefined as any,

    // step 4
    loanType: undefined as any,

    // step 5 (optional record)
    businessRequirements: {
      machinery: undefined,
      land: undefined,
      building: undefined,
      computersAndAccessories: undefined,
      furnituresAndFixtures: undefined,
      vehicle: undefined,
      softwareWebsiteAndApp: undefined,
      liveStockFarmAnimals: undefined,
      otherFixedExpenses: undefined,
      consumablesStocks: undefined,
      rawMaterials: undefined,
      workingExpenses: undefined,
    },

    // step 6 (optional record)
    monthlyExpenses: {
      salary: undefined,
      purchaseOfEquipments: undefined,
      freight: undefined,
      powerAndFuel: undefined,
      printingAndStationery: undefined,
      advertisement: undefined,
      miscellaneousExpenses: undefined,
      postageAndCourier: undefined,
      transportAndConveyance: undefined,
      staffWelfare: undefined,
      repairAndMaintenance: undefined,
      rent: undefined,
      electricityExpenses: undefined,
      purchaseOfRawMaterials: undefined,
      otherExpenses: undefined,
    },

    // step 7
    revenueDetails: {
      productName: "",
      salesType: undefined as any,
      salesRevenue: 0,
      yearlyGrowthRate: 0,
    },
    // step 8
    loanPeriod: 5,

    // step 9
    personalDetails: {
      fullName: "",
      email: "",
      mobile: "",
      businessMobile: "",
      personalAddress: "",
      businessAddress: "",
      gender: undefined as any,
      category: undefined as any,
      educationQualification: undefined as any,
      workExperience: undefined as any,
    },

    // step 10
    businessDetails: {
      businessName: "",
      legalConstitution: undefined as any,
      employementPotential: undefined as any,
      businessStartDate: undefined as any,
    },
  };

  const form = useForm<projectReportType>({
    resolver: zodResolver(projectReportSchema),
    mode: "onChange",
    defaultValues
  });

  const handleNextButton = async () => {
    const currentFields = steps[currentStep].fields;

    const isValid = await form.trigger(currentFields as any);

    if (isValid && !isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBackButton = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (values: projectReportType) => {
    try {

      const report = await axios.post("/api/project-report", values)


      console.log(report)

      const response = await axios.post("/api/download-report",
        {
          projectId: report.data.data._id
        },
        {
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
      toast.success(response.data.data.message);
    } catch (error: any) {
      toast.error("Error Creating Report")
    }

  };

  const renderCurrentStepContent = () => {
    return (
      <>
        {/* Step 1 */}
        <Step1 currentStep={currentStep} form={form} />

        {/* Step 2 */}
        <Step2 currentStep={currentStep} form={form} />

        {/* Step 3 */}
        <Step3 currentStep={currentStep} form={form} />

        {/* Step 4 */}
        <Step4 currentStep={currentStep} form={form} />

        {/* Step 5 */}
        <Step5 currentStep={currentStep} form={form} />

        {/* Step 6 */}
        <Step6 currentStep={currentStep} form={form} />

        {/* Step 7 */}
        <Step7 currentStep={currentStep} form={form} />

        {/* Step 8 */}
        <Step8 currentStep={currentStep} form={form} />

        {/* Step 9 */}
        <Step9 currentStep={currentStep} form={form} />

        {/* Step 10 */}
        <Step10 currentStep={currentStep} form={form} />
      </>
    );
  };

  return (
    <>
    <div className=" w-full  max-w-2xl">
     <div className="p-4 "><h1 className="text-2xl font-bold "> Create Project Report</h1></div>
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle>{currentForm.title}</CardTitle>
            <p className="text-muted-foreground text-xs">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <CardDescription>{currentForm.description}</CardDescription>
        </div>
        <Progress value={progress} />
      </CardHeader>
      <CardContent>
        <form id="multi-form" onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              custom={currentStep}
              variants={variants as any}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {renderCurrentStepContent()}
            </motion.div>
          </AnimatePresence>
        </form>
      </CardContent>
      <CardFooter>
        <Field className="justify-between" orientation="horizontal">
          {currentStep > 0 && (
            <Button className="cursor-pointer" type="button" variant="ghost" onClick={handleBackButton}>
              <ChevronLeft /> Back
            </Button>
          )}
          {!isLastStep && (
            <Button
              className="cursor-pointer"
              type="button"
              variant="secondary"
              onClick={handleNextButton}
            >
              Next
              <ChevronRight />
            </Button>
          )}
          {isLastStep && (
            <Button
              className="cursor-pointer"
              type="submit"
              form="multi-form"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Submit"}
            </Button>
          )}
        </Field>
      </CardFooter>
    </Card>
    </div>
    </>
  );
};

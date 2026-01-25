"use client";

import z from "zod";
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
import { step1Schema } from "./form-steps/Step1";
import { step2Schema } from "./form-steps/Step2";
import { step3Schema } from "./form-steps/Step3";
import { step4Schema } from "./form-steps/Step4";
import { step5Schema } from "./form-steps/Step5";
import { step6Schema } from "./form-steps/Step6";
import { step7Schema } from "./form-steps/Step7";
import { step8Schema } from "./form-steps/Step8";
import { step9Schema } from "./form-steps/Step9";
import { step10Schema } from "./form-steps/Step10";


export const formSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
  ...step5Schema.shape,
  ...step6Schema.shape,
  ...step7Schema.shape,
  ...step8Schema.shape,
  ...step9Schema.shape,
  ...step10Schema.shape,
});

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

export type FormSchema = z.infer<typeof formSchema>;

export const ProjectReportForm = () => {
  const steps = [
    {
      title: "Step 1",
      description: "",
      fields: ["legalBusinessName"],
    },
    {
      title: "Step 2",
      description: "",
      fields: ["businessType"],
    },
    {
      title: "Step 3",
      description: "",
      fields: ["industryType"],
    },
    {
      title: "Step 4",
      description: "",
      fields: ["loanType"],
    },
    {
      title: "Step 5",
      description: "",
      fields: [
        "machinery",
        "land",
        "building",
        "computersAccessories",
        "furnitureFixtures",
        "vehicle",
        "softwareWebsiteApp",
        "livestockFarmAnimalsEtc",
        "otherFixedExpenses",
        "consumablesStocks",
        "rawMaterials",
        "workingExpenses",
      ],
    },
    {
      title: "Step 6",
      description: "",
      fields: [
        "salaryWages",
        "purchaseOfEquipment",
        "freight",
        "powerFuel",
        "printingStationery",
        "advertisement",
        "miscellaneousExpenses",
        "postageCourier",
        "transportConveyance",
        "staffWelfare",
        "repairMaintenance",
        "rent",
        "electricityExpenses",
        "purchaseOfRawMaterials",
        "otherExpanses",
      ],
    },
    {
      title: "Step 7",
      description: "",
      fields: ["nameOfTheProductServices", "salesType", "monthlySalesRevenue"],
    },
    {
      title: "Step 8",
      description: "",
      fields: ["loanPeriodYears"],
    },
    {
      title: "Step 9",
      description: "",
      fields: [
        "fullName",
        "emailAddress",
        "mobileNumber",
        "businessMobile",
        "personalAddress",
        "businessAddress",
        "gender",
        "category",
        "educationQualification",
        "workExperience",
      ],
    },
    {
      title: "Step 10",
      description: "",
      fields: [
        "nameOfBusinessFirm",
        "legalConstitution",
        "employmentPotential",
        "whenDidYouStartTheBusiness",
      ],
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const currentForm = steps[currentStep];

  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    // shouldUnregister: true,
    defaultValues: {
      // step 1
      legalBusinessName: "",
      // step 2
      businessType: "",
      // step 3
      industryType: "manufacturing",
      // step 4
      loanType: "mudra",
      otherLoanType: "",
      // step 5
      machinery: false,
      land: false,
      building: false,
      computersAccessories: false,
      furnitureFixtures: false,
      vehicle: false,
      softwareWebsiteApp: false,
      livestockFarmAnimalsEtc: false,
      otherFixedExpenses: false,
      consumablesStocks: false,
      rawMaterials: false,
      workingExpenses: false,
      salaryWages: false,
      purchaseOfEquipment: false,
      freight: false,
      powerFuel: false,
      printingStationery: false,
      advertisement: false,
      miscellaneousExpenses: false,
      postageCourier: false,
      transportConveyance: false,
      staffWelfare: false,
      repairMaintenance: false,
      rent: false,
      electricityExpenses: false,
      purchaseOfRawMaterials: false,
      otherExpanses: false,
      nameOfTheProductServices: "",
      salesType: "",
      monthlySalesRevenue: "",
      loanPeriodYears: "",
      fullName: "",
      emailAddress: "",
      mobileNumber: "",
      businessMobile: "",
      personalAddress: "",
      businessAddress: "",
      gender: "",
      category: "",
      educationQualification: "",
      workExperience: "",
      nameOfBusinessFirm: "",
      legalConstitution: "",
      employmentPotential: "",
      whenDidYouStartTheBusiness: "",
    },
    mode: "onChange",
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

  const onSubmit = async (values: FormSchema) => {
    try {

      const response = await axios.post("/api/download-report",
        {
          data: values
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
    } catch (error) {
      toast.error("Error submitting form.")
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
  );
};

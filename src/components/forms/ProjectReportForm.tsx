"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldContent } from "@/components/ui/field";
import { EmailInput } from "@/components/ui/email-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import axios from "axios";

const formSchema = z.object({
  legalBusinessName: z
    .string()
    .min(1, "Legal Business Name is required")
    .max(255, "Legal Business Name must be at most 255 characters"),
  businessType: z
    .string()
    .min(1, "Business Type is required")
    .max(255, "Business Type must be at most 255 characters"),
  selectYourIndustry: z
    .string()
    .min(1, "Select Your Industry is required")
    .refine(
      (val) =>
        ["manufacturing", "service", "trading", "agriculture"].includes(val),
      "Select Your Industry must be a valid option",
    ),
  loanType: z
    .string()
    .min(1, "Loan Type is required")
    .refine(
      (val) => ["mudra", "pmegp", "msmeLoan", "others"].includes(val),
      "Loan Type must be a valid option",
    ),
  machinery: z.boolean(),
  land: z.boolean(),
  building: z.boolean(),
  computersAccessories: z.boolean(),
  furnitureFixtures: z.boolean(),
  vehicle: z.boolean(),
  softwareWebsiteApp: z.boolean(),
  livestockFarmAnimalsEtc: z.boolean(),
  otherFixedExpenses: z.boolean(),
  consumablesStocks: z.boolean(),
  rawMaterials: z.boolean(),
  workingExpenses: z.boolean(),
  salaryWages: z.boolean(),
  purchaseOfEquipment: z.boolean(),
  freight: z.boolean(),
  powerFuel: z.boolean(),
  printingStationery: z.boolean(),
  advertisement: z.boolean(),
  miscellaneousExpenses: z.boolean(),
  postageCourier: z.boolean(),
  transportConveyance: z.boolean(),
  staffWelfare: z.boolean(),
  repairMaintenance: z.boolean(),
  rent: z.boolean(),
  electricityExpenses: z.boolean(),
  purchaseOfRawMaterials: z.boolean(),
  otherExpanses: z.boolean(),
  nameOfTheProductServices: z
    .string()
    .min(1, "Name of the Product/services is required")
    .max(255, "Name of the Product/services must be at most 255 characters"),
  salesType: z
    .string()
    .min(1, "Sales Type is required")
    .refine(
      (val) =>
        ["salesBasedOnMonthlyBasis", "salesBasedOnUnitBasis"].includes(val),
      "Sales Type must be a valid option",
    ),
  monthlySalesRevenue: z
    .string()
    .max(255, "Monthly Sales Revenue must be at most 255 characters"),
  loanPeriodYears: z
    .string()
    .min(1, "Loan Period (Years) is required")
    .max(255, "Loan Period (Years) must be at most 255 characters"),
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .max(255, "Full Name must be at most 255 characters"),
  emailAddress: z
    .string()
    .min(1, "Email Address is required")
    .email("Invalid email address")
    .max(255, "Email Address must be at most 255 characters"),
  mobileNumber: z
    .string()
    .min(1, "Mobile Number is required")
    .refine(isValidPhoneNumber, "Invalid phone number"),
  businessMobile: z
    .string()
    .min(1, "Business Mobile is required")
    .refine(isValidPhoneNumber, "Invalid phone number"),
  personalAddress: z
    .string()
    .min(1, "Personal Address is required")
    .max(255, "Personal Address must be at most 255 characters"),
  businessAddress: z
    .string()
    .max(255, "Business Address must be at most 255 characters"),
  gender: z
    .string()
    .min(1, "Gender is required")
    .refine(
      (val) => ["male", "female", "other"].includes(val),
      "Gender must be a valid option",
    ),
  category: z
    .string()
    .min(1, "Category is required")
    .refine(
      (val) => ["general", "obc", "sc", "st"].includes(val),
      "Category must be a valid option",
    ),
  educationQualification: z
    .string()
    .min(1, "Education Qualification is required")
    .refine(
      (val) =>
        [
          "8thFailed",
          "8thPass",
          "10thPass",
          "12thPass",
          "graduate",
          "postGraduate",
          "phd",
          "Other",
        ].includes(val),
      "Education Qualification must be a valid option",
    ),
  workExperience: z
    .string()
    .min(1, "Work Experience is required")
    .refine(
      (val) => ["02Years", "23Years", "35Years", "5Years"].includes(val),
      "Work Experience must be a valid option",
    ),
  nameOfBusinessFirm: z
    .string()
    .min(1, "Name of Business Firm is required")
    .max(255, "Name of Business Firm must be at most 255 characters"),
  legalConstitution: z
    .string()
    .min(1, "Legal Constitution is required")
    .refine(
      (val) =>
        [
          "Proprietorship",
          "Partnership",
          "privateLtd",
          "llp",
          "others",
        ].includes(val),
      "Legal Constitution must be a valid option",
    ),
  employmentPotential: z
    .string()
    .min(1, "Employment Potential is required")
    .refine(
      (val) => ["0To2", "2To5", "5To10", "10Above"].includes(val),
      "Employment Potential must be a valid option",
    ),
  whenDidYouStartTheBusiness: z
    .string()
    .min(1, "When did you start the business? is required")
    .refine(
      (val) =>
        ["notStarted", "6MonthsAgo", "612MonthsAgo", "23YearsAgo"].includes(
          val,
        ),
      "When did you start the business? must be a valid option",
    ),
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
      duration: 0.3,
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

type FormSchema = z.infer<typeof formSchema>;

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
      fields: ["selectYourIndustry"],
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
    defaultValues: {
      legalBusinessName: "",
      businessType: "",
      selectYourIndustry: "",
      loanType: "",
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
        <FieldGroup className={`${currentStep === 0 ? "flex! flex-col! gap-4" : "hidden!"}`}>
          <Controller
            name="legalBusinessName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="legalBusinessName">
                  Legal Business Name
                </FieldLabel>
                <Input
                  {...field}
                  id="legalBusinessName"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your complete business name"
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Step 2 */}
        <FieldGroup className={`${currentStep === 1 ? "flex! flex-col gap-4" : "hidden!"}`}>
          <Controller
            name="businessType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="businessType">Business Type</FieldLabel>
                <Input
                  {...field}
                  id="businessType"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g., Snacks Making, Grocery Shop, Soap Manufacturing, Pickles manufacturing, Dairy Farm, etc."
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Step 3 */}
        <FieldGroup className={`${currentStep === 2 ? "flex! flex-col gap-4" : "hidden!"}`}>
          <Controller
            name="selectYourIndustry"
            control={form.control}
            render={({ field, fieldState }) => {
              const options = [
                { label: "Manufacturing", value: "manufacturing" },
                { label: "Service", value: "service" },
                { label: "Trading", value: "trading" },
                { label: "Agriculture", value: "agriculture" },
              ];

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="selectYourIndustry">
                    Select Your Industry
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={false}
                  >
                    <SelectTrigger
                      id="selectYourIndustry"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Choose the industry category that best fits your business" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select an industry</SelectLabel>
                          {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </FieldGroup>

        {/* Step 4 */}
        <FieldGroup className={`${currentStep === 3 ? "flex! flex-col gap-4" : "hidden!"}`}>
          <Controller
            name="loanType"
            control={form.control}
            render={({ field, fieldState }) => {
              const options = [
                { label: "Mudra", value: "mudra" },
                { label: "PMEGP", value: "pmegp" },
                { label: "MSME Loan", value: "msmeLoan" },
                { label: "Others", value: "others" },
              ];

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="loanType">Loan Type</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={false}
                  >
                    <SelectTrigger
                      id="loanType"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="What type of loan do you need for your business?" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select a loan type</SelectLabel>
                          {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </FieldGroup>

        {/* Step 5 */}
        <FieldGroup className={`${currentStep === 4 ? "flex! flex-col gap-4" : "hidden!"}`}>
          <Controller
            name="machinery"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="machinery"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="machinery">Machinery</FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="land"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="land"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="land">Land</FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="building"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="building"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="building">Building</FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="computersAccessories"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="computersAccessories"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="computersAccessories">
                    Computers & Accessories
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="furnitureFixtures"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="furnitureFixtures"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="furnitureFixtures">
                    Furniture & Fixtures
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="vehicle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="vehicle"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="vehicle">Vehicle</FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="softwareWebsiteApp"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="softwareWebsiteApp"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="softwareWebsiteApp">
                    Software, Website & App
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="livestockFarmAnimalsEtc"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="livestockFarmAnimalsEtc"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="livestockFarmAnimalsEtc">
                    Livestock, Farm Animals, ETC
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="otherFixedExpenses"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="otherFixedExpenses"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="otherFixedExpenses">
                    Other Fixed Expenses
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="consumablesStocks"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="consumablesStocks"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="consumablesStocks">
                    Consumables/Stocks
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="rawMaterials"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="rawMaterials"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="rawMaterials">
                    Raw Materials
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="workingExpenses"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="workingExpenses"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="workingExpenses">
                    Working Expenses
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>

        {/* Step 6 */}
        <FieldGroup className={`${currentStep === 5 ? "flex! flex-col gap-4" : "hidden!"}`}>
          <Controller
            name="salaryWages"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="salaryWages"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="salaryWages">
                    Salary & Wages
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="purchaseOfEquipment"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="purchaseOfEquipment"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="purchaseOfEquipment">
                    Purchase of Equipment
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="freight"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="freight"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="freight">Freight</FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="powerFuel"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="powerFuel"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="powerFuel">Power & Fuel</FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="printingStationery"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="printingStationery"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="printingStationery">
                    Printing & Stationery
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="advertisement"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="advertisement"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="advertisement">
                    Advertisement
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="miscellaneousExpenses"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="miscellaneousExpenses"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="miscellaneousExpenses">
                    Miscellaneous Expenses
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="postageCourier"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="postageCourier"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="postageCourier">
                    Postage & Courier
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="transportConveyance"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="transportConveyance"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="transportConveyance">
                    Transport & Conveyance
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="staffWelfare"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="staffWelfare"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="staffWelfare">
                    Staff Welfare
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="repairMaintenance"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="repairMaintenance"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="repairMaintenance">
                    Repair & Maintenance
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="rent"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="rent"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="rent">Rent</FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="electricityExpenses"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="electricityExpenses"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="electricityExpenses">
                    Electricity Expenses
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="purchaseOfRawMaterials"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="purchaseOfRawMaterials"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="purchaseOfRawMaterials">
                    Purchase of Raw Materials
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="otherExpanses"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
              >
                <Checkbox
                  id="otherExpanses"
                  name={field.name}
                  disabled={false}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldLabel htmlFor="otherExpanses">
                    Other Expanses
                  </FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>

        {/* Step 7 */}
        <FieldGroup className={`${currentStep === 6 ? "flex! flex-col gap-4" : "hidden!"}`}>
          <Controller
            name="nameOfTheProductServices"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="nameOfTheProductServices">
                  Name of the Product/services
                </FieldLabel>
                <Input
                  {...field}
                  id="nameOfTheProductServices"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter name of the product/services"
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="salesType"
            control={form.control}
            render={({ field, fieldState }) => {
              const options = [
                {
                  label: "Sales based on monthly basis",
                  value: "salesBasedOnMonthlyBasis",
                },
                {
                  label: "Sales based on unit basis",
                  value: "salesBasedOnUnitBasis",
                },
              ];

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="salesType">Sales Type</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={false}
                  >
                    <SelectTrigger
                      id="salesType"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select sales type" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select a sales type</SelectLabel>
                          {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="monthlySalesRevenue"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="monthlySalesRevenue">
                  Monthly Sales Revenue
                </FieldLabel>
                <Input
                  {...field}
                  id="monthlySalesRevenue"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter monthly sales revenue"
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Step 8 */}
        <FieldGroup className={`${currentStep === 7 ? "flex! flex-col gap-4" : "hidden"}`}>
          <Controller
            name="loanPeriodYears"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="loanPeriodYears">
                  Loan Period (Years)
                </FieldLabel>
                <Input
                  {...field}
                  id="loanPeriodYears"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter loan duration(5-10 years)"
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription>
                  Choose between 5 to 10 years for loan repayment
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Step 9 */}
        <FieldGroup className={`${currentStep === 8 ? "flex! flex-col gap-4" : "hidden!"}`}>
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  {...field}
                  id="fullName"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your full name"
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="emailAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="emailAddress">Email Address</FieldLabel>
                <EmailInput
                  {...field}
                  id="emailAddress"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your email"
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="mobileNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="mobileNumber">Mobile Number</FieldLabel>
                <PhoneInput
                  {...field}
                  id="mobileNumber"
                  placeholder="Enter your mobile number"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="businessMobile"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="businessMobile">
                  Business Mobile
                </FieldLabel>
                <PhoneInput
                  {...field}
                  id="businessMobile"
                  placeholder="Enter your business mobile number"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="personalAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="personalAddress">
                  Personal Address
                </FieldLabel>
                <Input
                  {...field}
                  id="personalAddress"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your complete address"
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="businessAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="businessAddress">
                  Business Address
                </FieldLabel>
                <Input
                  {...field}
                  id="businessAddress"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your complete business address"
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => {
              const options = [
                { label: "Male ", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ];

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={false}
                  >
                    <SelectTrigger
                      id="gender"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select your gender" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select your gender</SelectLabel>
                          {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => {
              const options = [
                { label: "General", value: "general" },
                { label: "OBC", value: "obc" },
                { label: "SC", value: "sc" },
                { label: "ST", value: "st" },
              ];

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={false}
                  >
                    <SelectTrigger
                      id="category"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select your category" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select your category</SelectLabel>
                          {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="educationQualification"
            control={form.control}
            render={({ field, fieldState }) => {
              const options = [
                { label: " 8th Failed", value: "8thFailed" },
                { label: "8th Pass", value: "8thPass" },
                { label: "10th Pass", value: "10thPass" },
                { label: "12th Pass", value: "12thPass" },
                { label: "Graduate", value: "graduate" },
                { label: "Post Graduate", value: "postGraduate" },
                { label: "PHD", value: "phd" },
                { label: " Other", value: "Other" },
              ];

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="educationQualification">
                    Education Qualification
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={false}
                  >
                    <SelectTrigger
                      id="educationQualification"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select your educational qualification" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>
                            Select your educational qualification
                          </SelectLabel>
                          {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="workExperience"
            control={form.control}
            render={({ field, fieldState }) => {
              const options = [
                { label: " 0-2 Years", value: "02Years" },
                { label: "2-3 Years", value: "23Years" },
                { label: "3-5 Years", value: "35Years" },
                { label: "5+ Years", value: "5Years" },
              ];

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="workExperience">
                    Work Experience
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={false}
                  >
                    <SelectTrigger
                      id="workExperience"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select your work experience" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select work experience</SelectLabel>
                          {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </FieldGroup>

        {/* Step 10 */}
        <FieldGroup className={`${currentStep === 9 ? "flex! flex-col gap-4" : "hidden!"}`}>
          <Controller
            name="nameOfBusinessFirm"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="nameOfBusinessFirm">
                  Name of Business Firm
                </FieldLabel>
                <Input
                  {...field}
                  id="nameOfBusinessFirm"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter name of your business firm"
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="legalConstitution"
            control={form.control}
            render={({ field, fieldState }) => {
              const options = [
                { label: " Proprietorship", value: "Proprietorship" },
                { label: " Partnership", value: "Partnership" },
                { label: "Private LTD", value: "privateLtd" },
                { label: "LLP", value: "llp" },
                { label: "Others", value: "others" },
              ];

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="legalConstitution">
                    Legal Constitution
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={false}
                  >
                    <SelectTrigger
                      id="legalConstitution"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select legal constitution" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select legal constitution</SelectLabel>
                          {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="employmentPotential"
            control={form.control}
            render={({ field, fieldState }) => {
              const options = [
                { label: " 0 to 2", value: "0To2" },
                { label: " 2 to 5", value: "2To5" },
                { label: " 5 to 10", value: "5To10" },
                { label: "10 Above", value: "10Above" },
              ];

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="employmentPotential">
                    Employment Potential
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={false}
                  >
                    <SelectTrigger
                      id="employmentPotential"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select your employment potential" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>
                            Select employment potential
                          </SelectLabel>
                          {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="whenDidYouStartTheBusiness"
            control={form.control}
            render={({ field, fieldState }) => {
              const options = [
                { label: "Not Started", value: "notStarted" },
                { label: "6 Months Ago", value: "6MonthsAgo" },
                { label: "6-12 Months Ago", value: "612MonthsAgo" },
                { label: "2-3 Years Ago", value: "23YearsAgo" },
              ];

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="whenDidYouStartTheBusiness">
                    When did you start the business?
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={false}
                  >
                    <SelectTrigger
                      id="whenDidYouStartTheBusiness"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select your business start status" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>
                            Select business start status
                          </SelectLabel>
                          {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </FieldGroup>
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
            <Button type="button" variant="ghost" onClick={handleBackButton}>
              <ChevronLeft /> Back
            </Button>
          )}
          {!isLastStep && (
            <Button
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

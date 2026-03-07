"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Field } from '../ui/field';

// Schemas
import { cmaReportSchema } from "@/Schemas/cmaReportSchema";
import { projectReportSchema } from "@/Schemas/projectReportSchema";

// Steps Components
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

// Animation Variants
const variants = {
    initial: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.1 } },
    exit: (direction: number) => ({ x: direction > 0 ? -50 : 50, opacity: 0, transition: { duration: 0.1 } }),
};

interface UnifiedFormProps {
    reportId?: string;
    type: 'cma' | 'project';
}

export const UnifiedReportForm = ({ reportId, type }: UnifiedFormProps) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(!reportId);
    const [direction, setDirection] = useState(0);

    // 1. Identify Edit Mode
    const isEditMode = !!reportId;

    // 2. Decide Schema based on report type
    const currentSchema = type === 'cma' ? cmaReportSchema : projectReportSchema;

    // Configuration for field validation per step
    const stepsConfig = [
        { fields: ["businessName"] },
        { fields: ["businessType"] },
        { fields: ["industryType"] },
        { fields: ["loanType"] },
        { fields: ["businessRequirements"] },
        { fields: ["monthlyExpenses"] },
        { fields: ["revenueDetails"] },
        { fields: ["loanPeriod"] },
        { fields: ["personalDetails"] },
        { fields: ["businessDetails"] },
    ];

    const form = useForm<any>({
        resolver: zodResolver(currentSchema),
        defaultValues: {
            businessName: "",
            businessType: "",
            industryType: "",
            loanType: "",
            businessRequirements: {},
            monthlyExpenses: {},
            revenueDetails: {
                productName: "",
                salesType: "monthly",
                salesRevenue: "",
                yearlyGrowthRate: ""
            },
            loanPeriod: 5,
            personalDetails: {
                fullName: "",
                email: "",
                mobile: "",
                businessMobile: "",
                personalAddress: "",
                businessAddress: "",
                gender: "",
                category: "",
                educationQualification: "",
                workExperience: ""
            },
            businessDetails: {
                businessName: "",
                legalConstitution: "",
                employementPotential: "",
                businessStartDate: ""
            }
        },
        mode: "onSubmit",
    });

    // 3. Load Data for Edit Mode
    useEffect(() => {
        if (reportId) {
            const fetchReportData = async () => {
                try {
                    // CHANGED: Using the unified edit endpoint for GET
                    const response = await axios.get(`/api/unified-reports/edit?id=${reportId}&type=${type}`);
                    if (response.data.data) {
                        form.reset(response.data.data);
                        setDataLoaded(true);
                    }
                } catch (error) {
                    toast.error("Failed to load report data");
                }
            };
            fetchReportData();
        }
    }, [reportId, type, form]);

    const stepsCount = 10;
    const progress = ((currentStep + 1) / stepsCount) * 100;

    // 4. Handle Navigation Logic
    const handleNextButton = async () => {
        const currentFields = stepsConfig[currentStep].fields;

        // Step 7 Custom Validation for Growth Rate
        if (currentStep === 6) {
            const val = form.getValues("revenueDetails.yearlyGrowthRate");
            const numVal = typeof val === 'string' ? parseFloat(val) : val;

            if (numVal === undefined || numVal === null || isNaN(numVal) || numVal < 5) {
                form.setError('revenueDetails.yearlyGrowthRate', {
                    type: 'manual',
                    message: 'Growth rate must be at least 5%',
                });
                return;
            }
        }

        const isValid = await form.trigger(currentFields as any);
        if (isValid) {
            setDirection(1);
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBackButton = () => {
        setDirection(-1);
        setCurrentStep((prev) => prev - 1);
    };

    // 5. Submit Logic
    const onSubmit = async (values: any) => {
        try {
            let response;

            if (isEditMode) {
                // For edit mode, use PUT to update existing report
                response = await axios.put(`/api/unified-reports/edit?id=${reportId}&type=${type}`, values);
                toast.success("Report updated successfully!");
            } else {
                // For create mode, use POST to create new report
                response = await axios.post("/api/unified-reports", { ...values, type });
                toast.success("Report created successfully!");
            }

            router.push(type === 'cma' ? "/dashboard?tab=cma" : "/dashboard");
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error(isEditMode ? "Failed to update report" : "Failed to create report");
        }
    };
    if (!dataLoaded) return <div className="flex justify-center p-20"><Spinner /> Loading Report Data...</div>;

    return (
        <div className="w-full max-w-2xl">
            <div className="p-4">
                <h1 className="text-2xl font-bold capitalize">
                    {isEditMode ? 'Edit' : 'Create'} {type} Report
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Step {currentStep + 1}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Step {currentStep + 1} of {stepsCount}
                        </p>
                    </div>
                    <Progress value={progress} />
                </CardHeader>
                <CardContent className="overflow-hidden">
                    <form id="multi-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentStep}
                                custom={direction}
                                variants={variants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                {/* All Steps share the same form instance */}
                                {currentStep === 0 && <Step1 currentStep={currentStep} form={form} />}
                                {currentStep === 1 && <Step2 currentStep={currentStep} form={form} />}
                                {currentStep === 2 && <Step3 currentStep={currentStep} form={form} />}
                                {currentStep === 3 && <Step4 currentStep={currentStep} form={form} />}
                                {currentStep === 4 && <Step5 currentStep={currentStep} form={form} />}
                                {currentStep === 5 && <Step6 currentStep={currentStep} form={form} />}
                                {currentStep === 6 && <Step7 currentStep={currentStep} form={form} />}
                                {currentStep === 7 && <Step8 currentStep={currentStep} form={form} />}
                                {currentStep === 8 && <Step9 currentStep={currentStep} form={form} />}
                                {currentStep === 9 && <Step10 currentStep={currentStep} form={form} />}
                            </motion.div>
                        </AnimatePresence>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field className="justify-between" orientation="horizontal">
                        <Button type="button" variant="ghost" onClick={handleBackButton} disabled={currentStep === 0}>
                            <ChevronLeft /> Back
                        </Button>
                        {currentStep < 9 ? (
                            <Button type="button" variant="secondary" onClick={handleNextButton}>
                                Next <ChevronRight />
                            </Button>
                        ) : (
                            <Button type="submit" form="multi-form" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <Spinner /> : isEditMode ? "Update Report" : "Final Submit"}
                            </Button>
                        )}
                    </Field>
                </CardFooter>
            </Card>
        </div>
    );
};
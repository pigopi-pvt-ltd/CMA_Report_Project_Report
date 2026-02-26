import { loanTypeEnum } from '@/Schemas/projectReportSchema';
import { Controller, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '../../ui/field';
import { cmaReportType } from '@/Schemas/cmaReportSchema';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
  currentStep: number;
  form: UseFormReturn<cmaReportType>;
}

export const step4Schema = z.object({
  loanType: loanTypeEnum,
  otherLoanType: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.loanType === "others" && (!data.otherLoanType || data.otherLoanType.trim() === "")) {
    ctx.addIssue({
      code: "custom",
      message: "Please specify your other loan type",
      path: ["otherLoanType"],
    });
  }
});

// Optional: Export the type for use in your UI
export type LoanType = z.infer<typeof step4Schema>["loanType"];

const Step4 = ({ currentStep, form }: Props) => {
  // Watch the loanType field
  const loanType = form.watch("loanType");

  if (currentStep !== 3) return null;

  return (
    <FieldGroup className="flex! flex-col gap-4">
      {/* Header */}
      <StepHeaderSection title="Loan Type" description="What type of loan do you need for your business?" />

      {/* Loan Type(loanType) */}
      <Controller
        name="loanType"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="loanType">Loan Type</FieldLabel>
            <Select onValueChange={(value) => {
              field.onChange(value);

            }} value={field.value}>
              <SelectTrigger id="loanType">
                <SelectValue placeholder="Select a loan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mudra">Mudra</SelectItem>
                <SelectItem value="pmegp">PMEGP</SelectItem>
                <SelectItem value="msme">MSME Loan</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Other Loan Type(otherLoanType) */}
    </FieldGroup>
  );
};

export default Step4

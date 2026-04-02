import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { projectReportType } from '@/Schemas/projectReportSchema';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
  currentStep: number;
  form: UseFormReturn<projectReportType>;
}

const Step2 = ({ currentStep, form }: Props) => {
  return (
    <FieldGroup className={`${currentStep === 1 ? "flex flex-col gap-6" : "hidden"}`}>
      {/* Header */}
      <StepHeaderSection title="Business Planning" description="What type of business are you planning to start?" />

      {/* Business Type(businessType) */}
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
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Executive Summary */}
      <Controller
        name="businessSummary"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="businessSummary">Executive Summary / Business Description</FieldLabel>
            <textarea
              {...field}
              id="businessSummary"
              aria-invalid={fieldState.invalid}
              placeholder="Describe your business model, target market, and operational plan here..."
              className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-4 py-3 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            />
            <FieldDescription>Provide a detailed summary of your project (will be printed in the report).</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  )
}

export default Step2

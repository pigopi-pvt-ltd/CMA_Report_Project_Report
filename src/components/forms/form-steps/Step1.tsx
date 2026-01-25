import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { FormSchema } from "../ProjectReportForm";
import { z } from 'zod';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
 currentStep: number;
 form: UseFormReturn<FormSchema>;
}

export const step1Schema = z.object({
 legalBusinessName: z
  .string()
  .min(1, "Legal Business Name is required")
  .max(255, "Legal Business Name must be at most 255 characters"),
});

const Step1 = ({ currentStep, form }: Props) => {
 return (
  <FieldGroup className={`${currentStep === 0 ? "flex! flex-col! gap-4" : "hidden!"}`}>
   {/* Header */}
   <StepHeaderSection title="Business Entity Name" description="Enter the complete legal name of your business entity" />

   {/* Legal Business Name(legalBusinessName) */}
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
 )
}

export default Step1
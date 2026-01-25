import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { formSchema } from '../ProjectReportForm';
import { z } from 'zod';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
 currentStep: number;
 form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const step2Schema = z.object({ businessType: z.string().min(1, "Business Type is required").max(255, "Business Type must be at most 255 characters"), });

const Step2 = ({ currentStep, form }: Props) => {
 return (
  <FieldGroup className={`${currentStep === 1 ? "flex! flex-col gap-4" : "hidden!"}`}>
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

export default Step2
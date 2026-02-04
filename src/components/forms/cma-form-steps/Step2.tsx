import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { cmaReportType } from '@/Schemas/cmaReportSchema';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
  currentStep: number;
  form: UseFormReturn<cmaReportType>;
}

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
            <FieldLabel>Business Type</FieldLabel>
            <Input {...field} placeholder="e.g. Grocery Shop" />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  )
}

export default Step2

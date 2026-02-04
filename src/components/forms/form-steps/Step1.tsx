import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { projectReportType } from '@/Schemas/projectReportSchema';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
  currentStep: number;
  form: UseFormReturn<projectReportType>;
}

const Step1 = ({ currentStep, form }: Props) => {
  return (
    <FieldGroup className={`${currentStep === 0 ? "flex! flex-col! gap-4" : "hidden!"}`}>
      {/* Header */}
      <StepHeaderSection title="Business Entity Name" description="Enter the complete legal name of your business entity" />

      {/* Legal Business Name(legalBusinessName) */}
      <Controller
        name="businessName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="businessName">
              Legal Business Name
            </FieldLabel>
            <Input
              {...field}
              id="businessName"
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

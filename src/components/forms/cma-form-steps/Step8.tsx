import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { cmaReportType } from '@/Schemas/cmaReportSchema';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
  currentStep: number;
  form: UseFormReturn<cmaReportType>;
}


const Step8 = ({ currentStep, form }: Props) => {
  return (
    <FieldGroup className={`${currentStep === 7 ? "flex! flex-col gap-4" : "hidden"}`}>
      <StepHeaderSection title="Loan Period" description="Choose the loan period that best suits your business needs and repayment capacity" />
      <Controller
        name="loanPeriod"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="loanPeriod">
              Loan Period (Years)
            </FieldLabel>
            <Input
              id="salesRevenue"
              type="number"
              placeholder="Enter Loan Duration (5-10 Years)"
              autoComplete="off"
              aria-invalid={fieldState.invalid}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
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
  )
}

export default Step8
